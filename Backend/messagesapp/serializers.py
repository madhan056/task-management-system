from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):

    title = serializers.CharField(required=True, allow_blank=False)

    class Meta:
        model = Task
        fields = "__all__"