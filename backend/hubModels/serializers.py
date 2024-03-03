from rest_framework import serializers
from .models import Transaction, SavingPlan, Wallet, CustomLabel

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

class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomLabel
        fields = ('id', 'name', 'color')

class WalletSerializer(serializers.ModelSerializer):
    monthly_incomes = serializers.SerializerMethodField(source='get_monthly_incomes')
    monthly_expenses = serializers.SerializerMethodField(source='get_monthly_expenses')
    labels = LabelSerializer(many=True)
    aggregated_expenses = serializers.SerializerMethodField(source='get_aggregated_expenses')

    class Meta:
        model = Wallet
        fields = ('current_amount', 'monthly_incomes', 'monthly_expenses', 'aggregated_expenses', 'labels')

    @staticmethod
    def get_monthly_incomes(obj):
        return obj.get_monthly_incomes()

    @staticmethod
    def get_monthly_expenses(obj):
        return obj.get_monthly_expenses()

    @staticmethod
    def get_aggregated_expenses(obj):
        return obj.get_aggregated_expenses()


class TransactionSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S")
    value = serializers.DecimalField(decimal_places=2, max_digits=10)
    amount = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()
    label = LabelSerializer(source='get_label',read_only=True)

    class Meta:
        model = Transaction
        fields = ('id', 'value', 'date', 'type', 'title', 'label', 'description', 'recurrent',
                  'amount', 'duration')

    @staticmethod
    def get_amount(obj):
        if obj.recurrent:
            return None
        return None

    @staticmethod
    def get_duration(obj):
        if obj.recurrent:
            return None
        return None


class SavingPlanSerializer(serializers.ModelSerializer):
    # days_to_end_goal = serializers.SerializerMethodField('get_days_to_end_goal')

    class Meta:
        model = SavingPlan
        fields = ('title', 'amount', 'active', 'goal_date', 'description')

    # def get_days_to_end_goal(self, obj):
    #     return (timezone.now() - obj.goal_date).days
