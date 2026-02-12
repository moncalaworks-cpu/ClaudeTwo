# Template: Django REST Framework ViewSet
# Usage: Copy and customize for your model

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import [Model]
from .serializers import [Model]Serializer
from .permissions import Is[Model]Owner  # Create custom permission


class [Model]ViewSet(viewsets.ModelViewSet):
    """
    API endpoint for [Model] management.

    Provides full CRUD operations with filtering and searching.
    """
    queryset = [Model].objects.all()
    serializer_class = [Model]Serializer
    permission_classes = [IsAuthenticated]

    # Filtering & Searching
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'created_at']
    search_fields = ['name', 'email']
    ordering_fields = ['created_at', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        """
        Filter [Models] based on authentication status.
        Admin can see all, others only their own.
        """
        if self.request.user.is_staff:
            return [Model].objects.all()
        return [Model].objects.filter(user=self.request.user)

    def get_permissions(self):
        """
        Set permissions based on action:
        - list/create: IsAuthenticated
        - retrieve/update/delete: IsOwner
        """
        if self.action in ['list', 'create']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated, Is[Model]Owner]

        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        """Override create to set current user."""
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """Override update to set modified_at timestamp."""
        serializer.save()

    @action(detail=True, methods=['post'])
    def custom_action(self, request, pk=None):
        """
        Custom action example.
        POST /api/[models]/{id}/custom_action/
        """
        [object] = self.get_object()

        # Your custom logic here
        return Response(
            {'message': 'Action completed'},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """
        Get recently created [models].
        GET /api/[models]/recent/
        """
        recent_items = self.get_queryset().order_by('-created_at')[:10]
        serializer = self.get_serializer(recent_items, many=True)
        return Response(serializer.data)


# URL Configuration (in urls.py)
# from rest_framework.routers import DefaultRouter
# from .views import [Model]ViewSet
#
# router = DefaultRouter()
# router.register(r'[models]', [Model]ViewSet, basename='[model]')
#
# urlpatterns = [
#     path('api/', include(router.urls)),
# ]
