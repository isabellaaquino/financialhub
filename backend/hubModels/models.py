from decimal import Decimal
from django.db import models, transaction
from django.db.models import QuerySet
from django.core.mail import send_mail
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from .managers import HubUserManager

from datetime import date
from dateutil.relativedelta import relativedelta


class HubUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField('email address', unique=True)
    first_name = models.CharField('first name', max_length=30, blank=True)
    last_name = models.CharField('last name', max_length=30, blank=True)
    date_joined = models.DateTimeField('date joined', auto_now_add=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

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
        '''
        Returns the wallet related to that user.
        '''
        return Wallet.objects.get(user_id=self.pk)

    def get_full_name(self):
        '''
        Returns the first_name plus the last_name, with a space in between.
        '''
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        '''
        Returns the short name for the user.
        '''
        return self.first_name

    def email_user(self, subject, message, from_email=None, **kwargs):
        '''
        Sends an email to this User.
        '''
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

    def get_current_amount(self):
        return self.current_amount

    def get_transactions(self) -> QuerySet['Transaction']:
        """
        Return a QuerySet of all non-recurrent Transactions related to a Wallet
        """
        return Transaction.objects.filter(wallet_id=self.pk, recurrent=False)

    def get_transactions_by_year(self, year) -> QuerySet['Transaction']:
        """
        Return a QuerySet of all Transactions related to a Wallet from specific year
        """
        return Transaction.objects.filter(wallet_id=self.pk, date__year=year).order_by('date')

    def get_latest_transactions(self) -> QuerySet['Transaction']:
        """
        Return a QuerySet of all Transactions related to a Wallet
        that has their `date` less than 3 months ago and ordered by date
        """
        three_months = date.today() + relativedelta(months=+3)
        return Transaction.objects.filter(wallet_id=self.pk, date__lt=three_months).order_by('date')

    def get_saving_plans(self) -> QuerySet['SavingPlan']:
        """
        Return a QuerySet of all SavingPlans related to a Wallet
        """
        return SavingPlan.objects.filter(wallet_id=self.pk)
    
    def get_monthly_income(self):
        """
        Returns the monthly income value of an user's Wallet
        """
        pass
    
    def get_monthly_debt(self):
        """
        Returns the monthly debt value of an user's Wallet
        """
        pass

    # TODO: create unittest for all methods


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
    
    def trigger_async_instatiation(self):
        pass
    
    def get_amount(self):
        return self.amount

    def get_duration(self):
        return self.duration        

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('EXPENSE', 'Expense'),
        ('TRANSFER', 'Transfer'),
        ('INCOME', 'Income'),
    ]

    title = models.CharField(max_length=200, default='Amazon Prime') # TODO: remove default value
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, null=False)
    value = models.DecimalField(decimal_places=2, max_digits=15)
    date = models.DateTimeField(auto_now=False)
    type = models.CharField(max_length=100, choices=TRANSACTION_TYPES)
    # TODO: Implement user be able to create and store their own labels
    user_label = models.CharField(max_length=30, blank=True, null=True)
    # Django convention is to avoid setting null=True to CharFields
    from_user = models.CharField(max_length=50, blank=True, null=True)
    to_user = models.CharField(max_length=100, blank=True, null=True)
    description = models.CharField(max_length=200, blank=True, null=True)
    update_wallet = models.BooleanField(default=True)
    # Recurrency section
    recurrent = models.BooleanField(default=False)
    base_transaction = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)

    def save(self, is_first_save=False):
        # Cloned transactions will never update wallet, since will they will only be a base transaction for future ones
        if self.update_wallet and is_first_save and not self.recurrent:
            amount = self.value if self.type == 'INCOME' else (-self.value)
            self.wallet.update_balance(amount)
            
        return super().save()
        
    def delete(self, using=None, keep_parents=False):
        # Rollback for the wallet's previous update
        if self.update_wallet:
            # If transaction doesn't have fk to a base
            if not self.recurrent:
                amount = (-self.value) if self.type == 'INCOME' else self.value
                self.wallet.update_balance(amount)
            
        return super().delete(using, keep_parents)

    @staticmethod
    def create_from_json(data: dict, user_pk: int):
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
            transaction.date = data.get("date")
        if data.get("updateWallet") is not None:
            transaction.update_wallet = data.get("updateWallet")
        
        # Recurrency section
        if data.get("recurrent") is True:
            transaction.recurrent = data.get("recurrent")
            # When a transaction is set to recurrent, we'll instantiate a copy of this transaction to be the base
            # for recurrency editions
            if not data.get("amount"):
                raise PermissionError() # TODO: Update exception
            
            if not data.get("duration"):
                raise PermissionError() # TODO: Update exception
            
            # TODO: Move this instatiation + fk's handling to another method
            
            transaction.save(is_first_save=True)
            
            TransactionRecurrency.objects.create(
                transaction=transaction,
                amount=data.get("amount"),
                duration=data.get("duration"),
            )
            
        else:
            transaction.save(is_first_save=True)

        return transaction
    
    def get_wallet(self):
        return self.wallet
    
    def get_recurrency(self):
        return TransactionRecurrency.objects.get(transaction_id=self.pk) if self.recurrent else None
    
    def is_from_wallet(self, wallet):
        if not isinstance(wallet, Wallet):
            raise Exception # TODO: customize exception
        
        if not self.get_wallet() == wallet:
            return False
        return True

    def is_recurrent(self):
        return self.recurrent


class SavingPlan(models.Model):
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    amount = models.DecimalField(decimal_places=2, max_digits=15)
    active = models.BooleanField(default=True)
    goal_date = models.DateField(blank=True, null=True)
    description = models.CharField(max_length=200)

    def toggle_active(self):
        self.active = not self.active
        self.save(update_fields=['active'])
