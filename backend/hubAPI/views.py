from django.http import JsonResponse
from django.db.models import QuerySet
from .utils import custom_server_error_response, custom_success_response, custom_user_error_response
from hubModels.serializers import MyTokenObtainPairSerializer
from hubModels.models import HubUser, Wallet, Transaction
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.parsers import JSONParser
from hubModels.serializers import SavingPlanSerializer, WalletSerializer, TransactionSerializer

from rest_framework_simplejwt.views import TokenObtainPairView

from hubModels.models import CustomLabel
from hubModels.serializers import LabelSerializer


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
    if (request.query_params.get('year') != ""):
        transactions = user.get_wallet().get_transactions_by_year(
            request.query_params.get('year'))
    else:
        transactions = user.get_wallet().get_transactions()

    transactions_serialized = TransactionSerializer(transactions, many=True)
    return Response(transactions_serialized.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_latest_transactions(request):
    user: HubUser = request.user

    latest_transactions = user.get_wallet().get_latest_transactions()
    latest_transactions_serialized = TransactionSerializer(
        latest_transactions, many=True)

    return Response(latest_transactions_serialized.data)
