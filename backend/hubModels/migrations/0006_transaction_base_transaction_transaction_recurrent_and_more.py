# Generated by Django 4.1.7 on 2023-05-26 16:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('hubModels', '0005_rename_wallet_id_savingplan_wallet'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='base_transaction',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='hubModels.transaction'),
        ),
        migrations.AddField(
            model_name='transaction',
            name='recurrent',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='TransactionRecurrency',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField()),
                ('duration', models.CharField(choices=[('DAYS', 'days'), ('WEEKS', 'weeks'), ('MONTHS', 'months'), ('YEARS', 'years')], max_length=6)),
                ('end_date', models.DateTimeField(blank=True, null=True)),
                ('transaction', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hubModels.transaction')),
            ],
        ),
    ]
