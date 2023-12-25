# Generated by Django 4.1.7 on 2023-06-21 02:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('hubModels', '0006_transaction_base_transaction_transaction_recurrent_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='transaction',
            name='from_user',
        ),
        migrations.RemoveField(
            model_name='transaction',
            name='to_user',
        ),
        migrations.RemoveField(
            model_name='transaction',
            name='user_label',
        ),
        migrations.AddField(
            model_name='transaction',
            name='recurrency',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to='hubModels.transactionrecurrency'),
        ),
        migrations.AlterField(
            model_name='savingplan',
            name='wallet',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='saving_plans', to='hubModels.wallet'),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='title',
            field=models.CharField(max_length=200),
        ),
        migrations.CreateModel(
            name='CustomLabel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=30)),
                ('color', models.CharField(max_length=6)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='labels', to='hubModels.wallet')),
            ],
        ),
        migrations.AddField(
            model_name='transaction',
            name='label',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='hubModels.customlabel'),
        ),
    ]
