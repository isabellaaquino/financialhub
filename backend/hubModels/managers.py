import datetime
from datetime import timedelta, date

from django.contrib.auth.base_user import BaseUserManager
from django.apps import apps

from django.db import models
from django.db.models import QuerySet, Sum, F

from django.db.models.functions import TruncMonth


class HubUserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, first_name, last_name, email, password, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name,
                          last_name=last_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        # Creation of a related wallet for the created user
        wallet_model = apps.get_model('hubModels', 'Wallet')

        wallet = wallet_model.objects.create(
            user_id=user.pk,
            current_amount=0
        )
        wallet.save()

        return user

    def create_user(self, first_name, last_name, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(first_name, last_name, email, password, **extra_fields)

    def create_superuser(self, first_name, last_name, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(first_name, last_name, email, password, **extra_fields)


class TransactionsQueryset(models.QuerySet):

    def expenses(self):
        return self.filter(type="EXPENSE")

    def earnings(self):
        return self.filter(type="EARNING")

    def get_in_range(self, start_date, end_date):
        return self.filter(date__range=[start_date, end_date]).order_by('date')

    def values_labels(self):
        return self.filter(label__isnull=False).values(label_name=F("label__name"), label_color=F("label__color"))

    def values_dates(self):
        return self.values('date')

    def values_months(self, year=datetime.datetime.now().year):
        return self.filter(date__year=year).annotate(month=TruncMonth('date')).values('month')

    def annotate_values(self):
        return self.annotate(value=Sum('value')).order_by()

    def group_by_dates(self):
        return self.values_dates().annotate_values()

    def group_by_months(self):
        return self.values_months().annotate_values()

    def group_by_labels(self):
        return self.values_labels().annotate_values()

    def add_empty_dates(self, start_date, end_date):
        """
        Adds dates where there are no transactions to fill the chart
        """
        grouped_transactions_list = list(self)
        all_dates = [start_date + timedelta(days=x)
                     for x in range((end_date - start_date).days + 1)]
        all_transactions_dates = [
            item.get('date') for item in grouped_transactions_list]

        for d in all_dates:
            if d not in all_transactions_dates:
                grouped_transactions_list.append({'date': d, 'value': 0})

        for item in grouped_transactions_list:
            item['date'] = item['date'].strftime('%m-%d-%Y')

        return grouped_transactions_list

    def add_empty_months(self):
        grouped_transactions_list = list(self)

        all_transactions_months = [
            item.get('month').month for item in grouped_transactions_list]

        for month in range(1, 13):
            if month not in all_transactions_months:
                grouped_transactions_list.append({'month': month, 'value': 0})

        return grouped_transactions_list


class TransactionsManager(models.Manager):

    def get_queryset(self):
        return TransactionsQueryset(self.model, using=self._db)
