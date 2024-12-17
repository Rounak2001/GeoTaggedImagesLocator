from rest_framework import serializers
from .models import FarmingData


class FarmingDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmingData
        fields = '__all__'
