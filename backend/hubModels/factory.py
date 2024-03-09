import datetime

from .models import HubUser, Transaction, TransactionRecurrency, Wallet
from faker import Faker
from faker.providers import DynamicProvider

transaction_types_provider = DynamicProvider(
    provider_name="transaction_type",
    elements=["EXPENSE", "EARNING"],
)

duration_type_provider = DynamicProvider(
    provider_name="duration_type",
    elements=["DAYS", "WEEKS", "MONTHS", "YEARS"],
)


def get_and_pop(kwarg, key):
    return kwarg.pop(key) if kwarg.get(key) else None


class TransactionFactory:
    def __init__(self) -> None:
        self.faker = Faker()
        # Adding custom providers
        self.faker.add_provider(transaction_types_provider)
        self.faker.add_provider(duration_type_provider)

    # There's no need for functions related to creation of wallets,
    # since the creation of users already creating its own related wallet
    def create_user(self, **kwargs):
        first_name = self.faker.unique.first_name()
        last_name = self.faker.unique.last_name()
        default_values = {
            'first_name': first_name,
            'last_name': last_name,
            'email': f'{first_name}@gmail.com',
            **kwargs
        }
        return HubUser.objects.create_user(**default_values)

    def create_superuser(self, **kwargs):
        first_name = self.faker.unique.first_name()
        last_name = self.faker.unique.last_name()
        default_values = {
            'first_name': first_name,
            'last_name': last_name,
            'email': f'{first_name}@gmail.com',
            **kwargs
        }
        return HubUser.objects.create_superuser(**default_values)
    
    # Transactions section
    @staticmethod
    def create_transaction(**kwargs):
        transaction = Transaction(**kwargs)
        transaction.save(is_first_save=True)
        return transaction

    def create_transaction_filled(self, wallet, **kwargs):
        values = {
            'wallet': wallet,
            'title': get_and_pop(kwargs, 'title') or self.faker.text(max_nb_chars=10),
            'value': get_and_pop(kwargs, 'value') or self.faker.random_number(digits=2),
            'type': get_and_pop(kwargs, 'type') or self.faker.transaction_type(),
            'description': get_and_pop(kwargs, 'description') or self.faker.sentence(),
            'date': get_and_pop(kwargs, 'date') or datetime.datetime.now(),
            **kwargs
        }

        return self.create_transaction(**values)
    
    def create_recurrent_transaction(self, user_pk, **kwargs):
        data = {
            'title': self.faker.text(max_nb_chars=10),
            'value': self.faker.random_number(digits=2),
            'type': self.faker.transaction_type(),
            'description': self.faker.sentence(),
            'date': datetime.datetime.now(),
            'recurrent': True,
            # Recurrency section
            'amount': kwargs.get('amount') or self.faker.random_int(min=1, max=31),
            'duration': kwargs.get('duration') or self.faker.duration_type()
        }

        transaction = Transaction.create_from_json(data, user_pk)
        return transaction

    @staticmethod
    def create_transaction_from_json(data, user_pk):
        transaction = Transaction.create_from_json(data, user_pk)
        return transaction
    
    
