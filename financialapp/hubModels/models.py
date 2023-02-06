from django.db.models import CharField, BooleanField, DateField, DecimalField, ForeignKey, Model, CASCADE, SET_NULL

from hubUser.models import HubUser
from datetime import date
from dateutil.relativedelta import relativedelta

class Wallet(Model):
    user_id = ForeignKey(HubUser, on_delete=CASCADE)
    current_amount = DecimalField(decimal_places=2, max_digits=15)

    def get_current_amount(self):
        return self.current_amount

    def get_transactions(self):
        """
        Return a QuerySet of all Transactions related to a Wallet
        """
        return Transaction.objects.filter(wallet_id=self.pk)

    def get_latest_transactions(self):
        """
        Return a QuerySett of all Transactions related to a Wallet
        that has their `date` less than 3 months ago and ordered by date
        """
        three_months = date.today() + relativedelta(months=+3)
        return Transaction.objects.filter(wallet_id=self.pk, date__ls_than=three_months).order_by('date')

    def get_saving_plans(self):
        """
        Return a QuerySet of all SavingPlans related to a Wallet
        """
        return SavingPlan.objects.filter(wallet_id=self.pk)

    # TODO: create unittest for all methods


class Transaction(Model):
    TRANSACTION_TYPES = [
        ('EXPENSE', 'Expense'),
        ('TRANSFER', 'Transfer'),
        ('INCOME', 'Income'),
    ]

    wallet_id = ForeignKey(Wallet, on_delete=CASCADE, null=False) 
    value = DecimalField(decimal_places=2, max_digits=15)
    date = DateField(auto_now=True)
    type = CharField(max_length=100, choices=TRANSACTION_TYPES)
    user_label = CharField(max_length=30, blank=True, null=True) # TODO: Implement user be able to create and store their own labels
    from_user = CharField(max_length=50, blank=True, null=True) # Django convention is to avoid setting null=True to CharFields
    to_user = CharField(max_length=100, blank=True, null=True)
    description = CharField(max_length=200)
    update_wallet = BooleanField(default=True)


class SavingPlan(Model):
    wallet_id = ForeignKey(Wallet, on_delete=CASCADE)
    title = CharField(max_length=50)
    amount = DecimalField(decimal_places=2, max_digits=15)
    active = BooleanField(default=True)
    goal_date = DateField(blank=True, null=True)
    description = CharField(max_length=200)

    def toggle_active(self):
        self.active = not self.active
        self.save(update_fields=['active'])
