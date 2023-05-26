from rest_framework import serializers
from .models import Transaction, SavingPlan, Wallet

from django.utils import timezone

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['email'] = user.email

        return token


class WalletSerializer(serializers.ModelSerializer):

    class Meta:
        model = Wallet
        fields = ('current_amount',)


class TransactionSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S")
    amount = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = ('id', 'value', 'date', 'type', 'title', 'description', 'recurrent',
                  'amount', 'duration')
        
    
    def get_amount(self, obj):
        if obj.recurrent:
            return obj.get_recurrency().get_amount()
        return None
    
    def get_duration(self, obj):
        if obj.recurrent:
            return obj.get_recurrency().get_duration()
        return None


class SavingPlanSerializer(serializers.ModelSerializer):
    # days_to_end_goal = serializers.SerializerMethodField('get_days_to_end_goal')

    class Meta:
        model = SavingPlan
        fields = ('title', 'amount', 'active', 'goal_date', 'description')

    # def get_days_to_end_goal(self, obj):
    #     return (timezone.now() - obj.goal_date).days
