from _decimal import Decimal
from django.test import TestCase
from .factory import TransactionFactory

from .models import Transaction


class TransactionTestCase(TestCase):
    STARTER_WALLET_AMOUNT = 1000

    def setUp(self):
        self.factory = TransactionFactory()
        self.user = self.factory.create_user()
        self.wallet = self.user.get_wallet()
        # Adding funds to user wallet
        self.wallet.update_balance(self.STARTER_WALLET_AMOUNT)
        
    def test_transaction_updates_wallet(self):
        """
        Check if a given transaction of type `EXPENSE`, when `update_wallet` is True, updates the wallet's current
        amount
        """
        transaction = self.factory.create_transaction_filled(self.wallet, transaction_type='EXPENSE', update_wallet=True)
        current_wallet_amount = self.STARTER_WALLET_AMOUNT - transaction.value
        self.assertEqual(Decimal(current_wallet_amount), self.wallet.get_current_amount())

    def test_transaction_is_from_wallet(self):
        transaction = self.factory.create_transaction_filled(self.wallet)
        self.assertEqual(transaction.is_from_wallet(self.wallet), True)

    def test_recurrent_transaction(self):
        """
        Check if creating a recurrent transaction successfully instantiates a `TransactionRecurrency` object with
        correct values using `create_from_json` function
        """
        transaction = self.factory.create_recurrent_transaction(self.user.pk, amount=2, duration="WEEKS")
        self.assertEqual(transaction.recurrent, True)

        recurrency = transaction.get_recurrency()
        self.assertIsNotNone(recurrency)
        self.assertEqual(recurrency.amount, 2)
        self.assertEqual(recurrency.duration, "WEEKS")
