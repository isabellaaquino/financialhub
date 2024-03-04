from django.db.models import QuerySet
from django.db.models import Sum
from .utils import custom_server_error_response, custom_success_response, custom_user_error_response
from hubModels.serializers import MyTokenObtainPairSerializer, MyTokenRefreshSerializer
from hubModels.models import HubUser, Transaction
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from hubModels.serializers import SavingPlanSerializer, WalletSerializer, TransactionSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from datetime import date
from datetime import timedelta
from hubModels.models import CustomLabel
from hubModels.serializers import LabelSerializer
from django.conf import settings
from django.db.models.functions import TruncDate


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        print("aT: " + response.data.get('access'))
        if response.data.get('refresh'):
            response.set_cookie(
                key=settings.SIMPLE_JWT["AUTH_COOKIE"],
                value=response.data['refresh'],
                # domain=settings.SIMPLE_JWT["AUTH_COOKIE_DOMAIN"],
                # path=settings.SIMPLE_JWT["AUTH_COOKIE_PATH"],
                expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
                secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
                samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
            )
            del response.data['refresh']
        return super().finalize_response(request, response, *args, **kwargs)


class MyTokenRefreshView(TokenRefreshView):
    serializer_class = MyTokenRefreshSerializer

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            print('error: Refresh token is required')
            return Response({'error': 'Refresh token is required'}, status=403)

        try:
            token = RefreshToken(refresh_token)
            access_token = str(token.access_token)
            print("new aT: " + access_token)
            return Response({'access_token': access_token, 'refresh_token': refresh_token})
        except Exception as e:
            print(str(e))
            return Response({'error': str(e)}, status=403)

    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('refresh'):
            response.set_cookie(
                key=settings.SIMPLE_JWT["AUTH_COOKIE"],
                value=response.data['refresh'],
                # domain=settings.SIMPLE_JWT["AUTH_COOKIE_DOMAIN"],
                # path=settings.SIMPLE_JWT["AUTH_COOKIE_PATH"],
                expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
                secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
                samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
            )
            del response.data['refresh']
        return super().finalize_response(request, response, *args, **kwargs)


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

    if int(chart_data) == 1:
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
            item['date'] = item['date'].strftime('%m-%d-%Y')

        return Response(grouped_transactions_list)

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
