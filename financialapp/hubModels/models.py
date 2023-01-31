from enum import Enum
from django.db.models import CharField, BooleanField, DateField, DecimalField, ForeignKey, Model, CASCADE, SET_NULL

from hubUser.models import HubUser

class Wallet(Model):
    user_id = ForeignKey(HubUser, on_delete=CASCADE)
    current_amount = DecimalField(decimal_places=2, max_digits=15)

    def get_current_amount(self):
        return self.current_amount

class Transaction(Model):
    TRANSACTION_TYPES = [
        ('EXPENSE', 'Expense'),
        ('TRANSFER', 'Transfer'),
        ('INCOME', 'Income'),
    ]

    wallet_id = ForeignKey(Wallet, on_delete=SET_NULL, null=True) 
    value = DecimalField(decimal_places=2, max_digits=15)
    date = DateField(auto_now=True)
    type = CharField(max_length=100, choices=TRANSACTION_TYPES)
    from_user = CharField(max_length=50, null=True) # Django convention is to avoid setting null=True to CharFields
    to_user = CharField(max_length=100, null=True)
    description = CharField(max_length=200)
    update_wallet = BooleanField(default=True)

