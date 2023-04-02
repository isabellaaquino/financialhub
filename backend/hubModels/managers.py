from django.contrib.auth.base_user import BaseUserManager


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

        # TODO: create a user's wallet as soon as the user is saved on the db
        # wallet = Wallet.objects.create(
        #     user_id=user.id,
        #     current_amount = 0
        # )
        # wallet.save()
        
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
