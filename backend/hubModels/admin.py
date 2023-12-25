from django.contrib import admin
from .models import CustomLabel, Transaction, SavingPlan, Wallet

# Register your models here.
admin.site.register(Wallet)
admin.site.register(Transaction)
admin.site.register(SavingPlan)
admin.site.register(CustomLabel)
