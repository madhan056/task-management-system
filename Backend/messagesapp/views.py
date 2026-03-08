from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, viewsets
from .models import Task
from .serializers import TaskSerializer
from django.utils import timezone
from datetime import datetime


class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-id')
    serializer_class = TaskSerializer

    def perform_update(self, serializer):
        task = serializer.save()

        # Auto Overdue Logic
        if task.status != "completed":
            task_datetime = datetime.combine(task.task_date, task.task_time)
            if task_datetime < timezone.now():
                task.status = "overdue"
                task.save()