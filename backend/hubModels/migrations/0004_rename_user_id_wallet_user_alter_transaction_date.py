# Generated by Django 4.1.1 on 2023-04-04 16:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hubModels', '0003_rename_wallet_id_transaction_wallet_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='wallet',
            old_name='user_id',
            new_name='user',
        ),
        migrations.AlterField(
            model_name='transaction',
            name='date',
            field=models.DateTimeField(),
        ),
    ]