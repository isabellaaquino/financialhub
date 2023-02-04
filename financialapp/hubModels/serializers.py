from rest_framework import serializers
from models import Transaction, SavingPlan, Wallet

from django.utils import timezone

class WalletSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Wallet
        fields = ('current_amount')

class TransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Transaction
        fields = ('value', 'date', 'type', 'description')


class SavingPlanSerializer(serializers.ModelSerializer):
    days_to_end_goal = serializers.SerializerMethodField('get_days_to_end_goal')

    class Meta:
        model = SavingPlan
        fields = ('title', 'amount', 'active', 'goal_date', 'description', 'get_days_to_end_goal')

    def get_days_to_end_goal(self, obj):
        return (timezone.now() - obj.goal_date).days