from django.db import models
from django.contrib.auth.models import AbstractBaseUser

# Create your models here.
class HubUser(AbstractBaseUser):
    username = models.CharField(max_length=250, blank=True)
    email = models.EmailField(
        unique=True, help_text="Your email is used for signing in. This cannot be changed later.",
        error_messages={'unique': "This email has already been used."}
    )