import datetime

from _decimal import Decimal
from dateutil.relativedelta import relativedelta
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
        transaction = self.factory.create_transaction_filled(self.wallet, type='EXPENSE', update_wallet=True)
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

        recurrency = transaction.recurrency
        self.assertIsNotNone(recurrency)
        self.assertEqual(recurrency.amount, 2)
        self.assertEqual(recurrency.duration, "WEEKS")

    def test_get_monthly_earnings(self):
        one_month_ago = datetime.datetime.today() - relativedelta(months=1)
        out_of_range = one_month_ago - relativedelta(days=1)
        in_range = one_month_ago + relativedelta(days=1)

        earnings_in_range = self.factory.create_transaction_filled(self.wallet, type="EARNING", value=150)
        earning_in_range2 = self.factory.create_transaction_filled(self.wallet, type="EARNING", value=50, date=in_range)
        earning_in_range3 = self.factory.create_transaction_filled(self.wallet, type="EARNING", value=300,
                                                                  date=one_month_ago)

        earning_out_of_range = self.factory.create_transaction_filled(self.wallet, type="EARNING", date=out_of_range)

        # these transactions shouldn't be considered in the queryset since it's not an earning
        expense_in_range = self.factory.create_transaction_filled(self.wallet, type="EXPENSE", date=in_range)

        # Sum of all set transactions values
        expected_value = 500
        monthly_earning = self.wallet.get_monthly_earnings()
        self.assertEqual(expected_value, monthly_earning)

    def test_get_monthly_expenses(self):
        one_month_ago = datetime.datetime.today() - relativedelta(months=1)
        out_of_range = one_month_ago - relativedelta(days=1)
        in_range = one_month_ago + relativedelta(days=1)

        expense_in_range = self.factory.create_transaction_filled(self.wallet, type="EXPENSE", value=150)
        expense_in_range2 = self.factory.create_transaction_filled(self.wallet, type="EXPENSE", value=50, date=in_range)
        expense_in_range3 = self.factory.create_transaction_filled(self.wallet, type="EXPENSE", value=300,
                                                                   date=one_month_ago)
        expense_out_of_range = self.factory.create_transaction_filled(self.wallet, type="EXPENSE",date=out_of_range)

        # this transaction shouldn't be considered in the queryset since it's an earning
        earning_in_range = self.factory.create_transaction_filled(self.wallet, type="EARNING", date=in_range)

        expected_value = 500
        monthly_earning = self.wallet.get_monthly_expenses()
        self.assertEqual(expected_value, monthly_earning)
