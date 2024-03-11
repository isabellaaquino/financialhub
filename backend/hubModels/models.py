from decimal import Decimal
from django.db import models
from django.db.models import QuerySet, Sum, F
from django.core.mail import send_mail
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from .managers import HubUserManager, TransactionsManager, TransactionsQueryset

from datetime import date, datetime, timedelta
from dateutil.relativedelta import relativedelta


class HubUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField('email address', unique=True)
    first_name = models.CharField('first name', max_length=30, blank=True)
    last_name = models.CharField('last name', max_length=30, blank=True)
    date_joined = models.DateTimeField('date joined', auto_now_add=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = HubUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'

    @staticmethod
    def create_from_json(data: dict):
        # TODO: Field validations
        user = HubUser()
        if data.get("firstName"):
            user.first_name = data.get("firstName")
        if data.get("lastName"):
            user.last_name = data.get("lastName")
        if data.get("password"):
            user.set_password(data.get("password"))
        if data.get("email"):
            user.email = data.get("email")

        user.save()

        # Creation of a related wallet for the created user
        user_wallet = Wallet.objects.create(
            user_id=user.pk,
            current_amount=0
        )

        user_wallet.save()

        return user

    def get_wallet(self) -> 'Wallet':
        """
        Returns the wallet related to that user.
        """
        return Wallet.objects.get(user_id=self.pk)

    def get_labels(self) -> QuerySet['CustomLabel']:
        """
        Return all CustomLabels related to that user
        """
        return self.get_wallet().get_labels()

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        """
        Returns the short name for the user.
        """
        return self.first_name

    def email_user(self, subject, message, from_email=None, **kwargs):
        """
        Sends an email to this User.
        """
        send_mail(subject, message, from_email, [self.email], **kwargs)


class Wallet(models.Model):
    user = models.ForeignKey(HubUser, on_delete=models.CASCADE)
    current_amount = models.DecimalField(decimal_places=2, max_digits=15)

    constraints = [
        models.UniqueConstraint(fields=['user'], name='unique wallet per user')
    ]

    def update_balance(self, value):
        self.current_amount = self.current_amount + Decimal(value)
        self.save(update_fields=['current_amount'])

    def set_balance(self, value):
        self.current_amount = Decimal(value)
        self.save(update_fields=['current_amount'])

    def get_current_amount(self):
        return self.current_amount

    def get_transactions(self) -> TransactionsQueryset:
        """
        Return a QuerySet of all non-recurrent Transactions related to a Wallet
        """
        return self.transactions.filter(recurrent=False)

    def get_expenses(self) -> TransactionsQueryset:
        """
        Return a QuerySet of all non-recurrent Transactions related to a Wallet
        """
        return self.get_transactions().expenses()

    def get_monthly_earnings(self):
        """
        Returns the monthly earnings value of a user's Wallet
        """
        this_month = datetime.now().month
        return self.transactions.filter(date__month=this_month, type="EARNING") \
            .aggregate(Sum('value')).get('value__sum') or 0

    def get_monthly_expenses(self):
        """
        Returns the monthly debt value of a user's Wallet
        """
        this_month = datetime.now().month
        return self.transactions.filter(date__month=this_month, type="EXPENSE")\
            .aggregate(Sum('value')).get('value__sum') or 0

    def get_saving_plans(self):
        pass

    def get_labels(self) -> QuerySet['CustomLabel']:
        return self.labels.all()


class WalletBasedModel(models.Model):
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, null=False)

    class Meta:
        abstract = True

    def get_wallet(self):
        return self.wallet

    def is_from_wallet(self, wallet):
        if not isinstance(wallet, Wallet):
            raise Exception  # TODO: customize exception

        if not self.get_wallet() == wallet:
            return False
        return True


class CustomLabel(WalletBasedModel):
    # OVERRIDE
    wallet = models.ForeignKey(
        Wallet, on_delete=models.CASCADE, null=False, related_name='labels')

    name = models.CharField(max_length=30, blank=False, null=False)
    color = models.CharField(max_length=7, blank=False,
                             null=False)  # HEX FIELD

    def __str__(self):
        return self.name

    @staticmethod
    def create_from_json(data: dict, user_pk: int) -> 'CustomLabel':
        try:
            user: HubUser = HubUser.objects.get(pk=user_pk)
        except HubUser.DoesNotExist:
            raise PermissionError()

        user_wallet = user.get_wallet()

        if not user_wallet:
            raise PermissionError()

        label = CustomLabel()
        label.wallet = user_wallet

        if not data.get("name"):
            raise Exception("Title is required.")
        label.name = data.get("name")

        if not data.get("color"):
            raise Exception("Color is required.")
        label.color = data.get("color")

        label.save()

        return label


class TransactionRecurrency(models.Model):
    """
    Class that will store the amount of a time a certain transaction
    will be replicated starting from a determined date.
    """
    DURATION_TYPES = [
        ('DAYS', 'days'),
        ('WEEKS', 'weeks'),
        ('MONTHS', 'months'),
        ('YEARS', 'years'),
    ]
    transaction = models.ForeignKey('Transaction', on_delete=models.CASCADE)
    amount = models.IntegerField()
    duration = models.CharField(max_length=6, choices=DURATION_TYPES)
    end_date = models.DateTimeField(blank=True, null=True)

    def trigger_async_instantiation(self):
        pass

    def get_amount(self):
        return self.amount

    def get_duration(self):
        return self.duration


class Transaction(WalletBasedModel):
    TRANSACTION_TYPES = [
        ('EXPENSE', 'Expense'),
        ('EARNING', 'Earning'),
    ]

    title = models.CharField(max_length=200, blank=False, null=False)
    wallet = models.ForeignKey(
        Wallet, on_delete=models.CASCADE, null=False, related_name='transactions')
    value = models.DecimalField(decimal_places=2, max_digits=15)
    date = models.DateField(auto_now=False)
    type = models.CharField(max_length=7, choices=TRANSACTION_TYPES, null=True)
    label = models.ForeignKey(CustomLabel, on_delete=models.SET_NULL, null=True, blank=True)
    imported = models.BooleanField(default=False, null=True, blank=True)
    # Django convention is to avoid setting null=True to CharFields
    update_wallet = models.BooleanField(default=False)
    # Recurrency section
    recurrent = models.BooleanField(default=False)
    recurrency = models.OneToOneField(
        TransactionRecurrency, on_delete=models.CASCADE, null=True, blank=True, related_name='+')
    base_transaction = models.ForeignKey(
        'self', on_delete=models.SET_NULL, null=True, blank=True)
    # Manager section
    objects = TransactionsManager()

    def save(self, is_first_save=False, **kwargs):
        # Cloned transactions will never update wallet, since will they will only be a base transaction for future ones
        if self.update_wallet and is_first_save and not self.recurrent:
            amount = self.value if self.type == 'EARNING' else (-self.value)
            self.wallet.update_balance(amount)

        return super().save(**kwargs)

    def delete(self, **kwargs):
        # Rollback for the wallet's previous update
        if self.update_wallet:
            # If transaction doesn't have fk to a base
            if not self.recurrent:
                amount = (-self.value) if self.type == 'EARNING' else self.value
                self.wallet.update_balance(amount)

        return super().delete(**kwargs)

    @staticmethod
    def create_from_json(data: dict, user_pk: int) -> 'Transaction':
        """
        Creates a transaction from a frontend request
        @params: 
            data : dict
        """
        # TODO: Field validations
        try:
            user: HubUser = HubUser.objects.get(pk=user_pk)
        except HubUser.DoesNotExist:
            raise PermissionError()

        user_wallet = user.get_wallet()

        if not user_wallet:
            raise PermissionError()

        transaction = Transaction()
        transaction.wallet = user_wallet

        # TODO: Update required attributes
        if data.get("title"):
            transaction.title = data.get("title")

        if data.get("label"):
            print(data)
            custom_label = CustomLabel.objects.get(
                pk=data.get("label").get("id"))
            if custom_label.get_wallet() != user_wallet:
                raise PermissionError()
            transaction.label = custom_label

        if data.get("description"):
            transaction.description = data.get("description")

        # Value section
        if data.get("value") is not None:
            transaction.value = data.get("value")
        else:
            raise PermissionError()

        if data.get("type"):
            transaction.type = data.get("type")
        if data.get("date"):
            date_string = data.get("date")
            date_object = datetime.strptime(
                date_string, "%Y-%m-%dT%H:%M:%S.%fZ")
            transaction.date = date_object.date()
        if data.get("updateWallet") is not None:
            transaction.update_wallet = data.get("updateWallet")

        # Recurrency section
        if data.get("recurrent") is True:
            transaction.recurrent = data.get("recurrent")
            # When a transaction is set to recurrent, we'll instantiate a copy of this transaction to be the base
            # for recurrency editions
            if not data.get("amount"):
                raise PermissionError()  # TODO: Update exception

            if not data.get("duration"):
                raise PermissionError()  # TODO: Update exception

            # TODO: Move this instantiation + fk's handling to another method

            transaction.save(is_first_save=True)

            recurrency = TransactionRecurrency.objects.create(
                transaction=transaction,
                amount=data.get("amount"),
                duration=data.get("duration"),
            )

            transaction.recurrency = recurrency
            transaction.save()

        else:
            transaction.save(is_first_save=True)

        return transaction

    @staticmethod
    def create_from_import(imported_data, optional_data, user):
        """
        Creates a transaction from a frontend request
        @params:
            data : dict
        """
        user_wallet = user.get_wallet()

        if not user_wallet:
            raise PermissionError()

        transaction = Transaction()
        transaction.wallet = user_wallet
        # Imported transactions will always be flagged as imported until they have all the fields completed
        transaction.imported = True

        # Empty fields section
        transaction.title = ''
        transaction.type = optional_data.get('type')
        transaction.update_wallet = optional_data.get('update_wallet')

        # Invoice dict section
        transaction.value = imported_data.get("value")
        transaction.date = imported_data.get("date")

        transaction.save(is_first_save=True)

    def is_recurrent(self):
        return self.recurrent

    def get_label(self):
        return self.label


class SavingPlan(WalletBasedModel):
    wallet = models.ForeignKey(
        Wallet, on_delete=models.CASCADE, related_name='saving_plans')
    title = models.CharField(max_length=50)
    amount = models.DecimalField(decimal_places=2, max_digits=15)
    active = models.BooleanField(default=True)
    goal_date = models.DateField(blank=True, null=True)
    description = models.CharField(max_length=200)

    def toggle_active(self):
        self.active = not self.active
        self.save(update_fields=['active'])
