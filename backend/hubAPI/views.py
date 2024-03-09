import os
from django.http import JsonResponse
from django.db.models import QuerySet, Sum
from .utils import custom_server_error_response, custom_success_response, custom_user_error_response
from hubModels.serializers import MyTokenObtainPairSerializer
from hubModels.models import HubUser, Transaction
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import FileUploadParser
from hubModels.serializers import SavingPlanSerializer, WalletSerializer, TransactionSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from datetime import date
from datetime import timedelta
from hubModels.models import CustomLabel
from hubModels.serializers import LabelSerializer
from hubModels.importer import PDFInvoiceImporter, InvoiceProcessingException
from django.conf import settings
from django.db.models.functions import TruncDate


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class WalletAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = WalletSerializer

    def get(self, request):
        user: HubUser = request.user

        wallet = user.get_wallet()
        wallet_serialized = WalletSerializer(wallet)

        return Response(wallet_serialized.data)

    def put(self, request):
        user: HubUser = request.user
        wallet = user.get_wallet()

        try:
            value = float(request.data)
        except (ValueError, TypeError):
            return custom_user_error_response("Entered value needs to be a number. Please try again.", 422)

        wallet.set_balance(value)

        return custom_success_response("Wallet's balance successfully updated!")


class TransactionAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TransactionSerializer

    def post(self, request):
        user: HubUser = request.user

        data = request.data
        transaction = Transaction.create_from_json(data, user_pk=user.pk)

        # TODO: Change response to message string
        return custom_success_response("Transaction created with success!")

    def delete(self, request, transaction_pk):
        user: HubUser = request.user

        if not transaction_pk:
            return custom_server_error_response("No transaction id was given. Please try again.")

        transaction = Transaction.objects.get(pk=transaction_pk)

        # Transaction does not belong to the requesting user
        if not transaction.is_from_wallet(user.get_wallet()):
            raise PermissionError()

        transaction.delete()

        return custom_success_response("Transaction deleted with success!")


class LabelAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = LabelSerializer

    def get(self, request):
        user: HubUser = request.user

        labels = user.get_labels()
        serializer = self.serializer_class(labels, many=True)

        return Response(serializer.data)

    def post(self, request):
        user: HubUser = request.user

        data = request.data
        CustomLabel.create_from_json(data, user_pk=user.pk)

        return custom_success_response("Label created with success!")

    def delete(self, request, label_pk):
        user: HubUser = request.user

        if not label_pk:
            return custom_server_error_response("No label id was given. Please try again.")

        label = CustomLabel.objects.get(pk=label_pk)

        # Transaction does not belong to the requesting user
        if not label.is_from_wallet(user.get_wallet()):
            raise PermissionError()

        label.delete()

        return custom_success_response("Label deleted with success!")


class ImportInvoicesAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, institution):
        user: HubUser = request.user

        files_list = request.FILES.getlist('files[]')

        file_path = 'hubAPI/imported_files/buffer.pdf'

        for uploaded_file in files_list:
            with open(file_path, 'wb') as file:
                file.write(uploaded_file.read())

            try:
                invoice_dict = PDFInvoiceImporter(file_path, institution).process_file()
            except InvoiceProcessingException:
                os.remove(file_path)
                return custom_user_error_response(InvoiceProcessingException.message)

            os.remove(file_path)

            if not invoice_dict.get('value') and not invoice_dict.get('date'):
                return custom_user_error_response(InvoiceProcessingException.message)

            try:
                Transaction.create_from_import(invoice_dict, user)
            except Exception as e:
                return custom_user_error_response('Something went wrong. Please try again.')

        return custom_success_response('Invoices were successfully imported. Please finish updating your transactions.')


@api_view(['GET'])
def get_routes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
        '/api/register',
        '/api/wallet',
        '/api/savingplans',
        '/api/transactions',
        '/api/latesttransactions',
        '/api/transaction',
    ]

    return Response(routes)


@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def create_user(request):
    data = request.data
    user = HubUser.create_from_json(data)
    return Response("ok")


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_saving_plans(request):
    user: HubUser = request.user

    saving_plans = user.get_wallet().get_saving_plans()
    saving_plans_serialized = SavingPlanSerializer(saving_plans, many=True)

    return Response(saving_plans_serialized.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_transactions(request):
    user: HubUser = request.user
    transactions: QuerySet

    start_date_str = request.query_params.get('start_date')
    end_date_str = request.query_params.get('end_date')
    # number of transactions returned
    limit = request.query_params.get('limit')
    # return only values grouped by date for charts
    chart_data = request.query_params.get('chart_data')

    if start_date_str and end_date_str:
        start_date = date.fromisoformat(start_date_str)
        end_date = date.fromisoformat(end_date_str)
        transactions = user.get_wallet().get_transactions_in_range(start_date, end_date)
    else:
        transactions = user.get_wallet().get_transactions()

    if limit and int(limit) > 0:
        transactions = transactions[:int(limit)]

    if chart_data and int(chart_data) == 1:
        # Group by date and sum values
        grouped_transactions = transactions.annotate(
            transaction_date=TruncDate('date')
        ).values('date').annotate(
            value=Sum('value')
        )

        grouped_transactions_list = list(grouped_transactions)
        all_dates = [start_date + timedelta(days=x)
                     for x in range((end_date - start_date).days + 1)]
        all_transactions_dates = [
            item.get('date') for item in grouped_transactions_list]

        for d in all_dates:
            if d not in all_transactions_dates:
                grouped_transactions_list.append({'date': d, 'value': 0})

        for item in grouped_transactions_list:
            item['date'] = item.get('date').strftime('%m-%d-%Y')

        return Response(grouped_transactions_list)

    transactions_serialized = TransactionSerializer(transactions, many=True)
    return Response(transactions_serialized.data)

