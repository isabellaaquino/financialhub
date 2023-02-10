from django.http import JsonResponse
from hubModels.serializers import MyTokenObtainPairSerializer
from hubModels.models import HubUser, Wallet
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from hubModels.serializers import SavingPlanSerializer, WalletSerializer, TransactionSerializer

from rest_framework_simplejwt.views import TokenObtainPairView


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    

# class GetUsersSavingPlansView(APIView):
#     def get_queryset(self):
#         user : HubUser = self.request.user

#         return user.get_wallet().get_saving_plans()
    


@api_view(['GET'])
def get_routes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
        '/api/wallet',
        '/api/savingplans',
        '/api/transactions',
        '/api/latesttransactions'
    ]

    return Response(routes)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wallet(request):
    user: HubUser = request.user

    wallet = user.get_wallet()
    wallet_serialized = WalletSerializer(wallet)

    return Response(wallet_serialized.data)



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

    transactions = user.get_wallet().get_transactions()
    transactions_serialized = TransactionSerializer(transactions, many=True)

    return Response(transactions_serialized.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_latest_transactions(request):
    user: HubUser = request.user

    latest_transactions = user.get_wallet().get_latest_transactions()
    latest_transactions_serialized = TransactionSerializer(latest_transactions, many=True)

    return Response(latest_transactions_serialized.data)



