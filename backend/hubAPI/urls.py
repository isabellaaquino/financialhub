from django.urls import path, re_path
from . import views
from .views import MyTokenObtainPairView, TransactionDetail, get_wallet, get_saving_plans, get_transactions, get_latest_transactions, create_user

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('', views.get_routes),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', create_user, name='create_user'),
    path('wallet/', get_wallet, name='wallet'),
    path('savingplans/', get_saving_plans, name='saving_plans'),
    path('transactions/', get_transactions, name='transactions'),
    path('latesttransactions/', get_latest_transactions,
         name='latest_transactions'),
    path('transaction/', TransactionDetail.as_view(), name='transaction'),
    path('transaction/<int:transaction_pk>', TransactionDetail.as_view(), name='transaction')
]
