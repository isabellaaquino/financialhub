from django.db import models
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
    user_id = models.ForeignKey(HubUser, on_delete=models.CASCADE)
    current_amount = models.DecimalField(decimal_places=2, max_digits=15)

    def get_current_amount(self):
        return self.current_amount

    def get_transactions(self) -> QuerySet['Transaction']:
        """
        Return a QuerySet of all Transactions related to a Wallet
        """
        return Transaction.objects.filter(wallet_id=self.pk)

    def get_latest_transactions(self) -> QuerySet['Transaction']:
        """
        Return a QuerySett of all Transactions related to a Wallet
        that has their `date` less than 3 months ago and ordered by date
        """
        three_months = date.today() + relativedelta(months=+3)
        return Transaction.objects.filter(wallet_id=self.pk, date__lt=three_months).order_by('date')

    def get_saving_plans(self) -> QuerySet['SavingPlan']:
        """
        Return a QuerySet of all SavingPlans related to a Wallet
        """
        return SavingPlan.objects.filter(wallet_id=self.pk)

    # TODO: create unittest for all methods


class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('EXPENSE', 'Expense'),
        ('TRANSFER', 'Transfer'),
        ('INCOME', 'Income'),
    ]

    wallet_id = models.ForeignKey(Wallet, on_delete=models.CASCADE, null=False) 
    value = models.DecimalField(decimal_places=2, max_digits=15)
    date = models.DateTimeField(auto_now=True)
    type = models.CharField(max_length=100, choices=TRANSACTION_TYPES)
    user_label = models.CharField(max_length=30, blank=True, null=True) # TODO: Implement user be able to create and store their own labels
    from_user = models.CharField(max_length=50, blank=True, null=True) # Django convention is to avoid setting null=True to CharFields
    to_user = models.CharField(max_length=100, blank=True, null=True)
    description = models.CharField(max_length=200)
    update_wallet = models.BooleanField(default=True)


class SavingPlan(models.Model):
    wallet_id = models.ForeignKey(Wallet, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    amount = models.DecimalField(decimal_places=2, max_digits=15)
    active = models.BooleanField(default=True)
    goal_date = models.DateField(blank=True, null=True)
    description = models.CharField(max_length=200)

    def toggle_active(self):
        self.active = not self.active
        self.save(update_fields=['active'])
