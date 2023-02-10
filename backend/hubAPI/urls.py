from django.urls import path
from . import views
from .views import MyTokenObtainPairView, get_wallet, get_saving_plans, get_transactions, get_latest_transactions

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('', views.get_routes),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('wallet/', get_wallet, name='wallet'),
    path('savingplans/', get_saving_plans, name='saving_plans'),
    path('transactions/', get_transactions, name='transactions'),
    path('latesttransactions/', get_latest_transactions, name='latest_transactions')
]
