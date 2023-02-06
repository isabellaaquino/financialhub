from django.db import models
from django.contrib.auth.models import AbstractBaseUser

# Create your models here.
class HubUser(AbstractBaseUser):
    avatar = models.ImageField(null=True, blank=True, upload_to="images/")
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(
        unique=True, help_text="Your email is used for signing in. This cannot be changed later.",
        error_messages={'unique': "This email has already been used."}
    )