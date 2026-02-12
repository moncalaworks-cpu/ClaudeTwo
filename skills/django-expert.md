# Django Expert Skill

Comprehensive knowledge of Django, Django REST Framework, async patterns, and PostgreSQL.

## Django ORM Fundamentals

### Model Definition

```python
# ✅ Well-designed model with proper fields
class User(models.Model):
    email = models.EmailField(unique=True, max_length=255)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


# ✅ Proper relationships
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('completed', 'Completed'),
            ('cancelled', 'Cancelled'),
        ],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order {self.id} by {self.user.email}"


# ❌ Avoid: Circular imports or overly complex relationships
class BadModel(models.Model):
    related = models.ForeignKey('circular.reference.Model', ...)
```

### Query Patterns

```python
# ✅ Use select_related for foreign keys
users_with_orders = User.objects.select_related('profile').all()

# ✅ Use prefetch_related for reverse relationships
users = User.objects.prefetch_related('orders').all()

# ✅ Filter with F expressions for comparisons
from django.db.models import F
recent_orders = Order.objects.filter(
    updated_at__gt=F('created_at') + timedelta(hours=1)
)

# ✅ Annotation with aggregates
from django.db.models import Count, Sum, Avg
user_stats = User.objects.annotate(
    total_orders=Count('orders'),
    total_spent=Sum('orders__total_amount'),
    avg_order_value=Avg('orders__total_amount')
).filter(total_orders__gt=0)

# ✅ Use values() to get only specific fields
emails = User.objects.values_list('email', flat=True)
user_data = User.objects.values('id', 'email', 'full_name')

# ❌ Avoid: N+1 queries
for user in User.objects.all():  # Query 1
    print(user.orders.count())   # Query per user!

# ✅ Correct: Prefetch or annotate
users = User.objects.annotate(order_count=Count('orders'))
for user in users:
    print(user.order_count)  # No extra query

# ❌ Avoid: Loading all objects into memory
all_users = User.objects.all()  # All users loaded

# ✅ Correct: Stream with iterator()
for user in User.objects.all().iterator(chunk_size=1000):
    process_user(user)
```

### Transactions & Atomic Operations

```python
from django.db import transaction

# ✅ Atomic block for related operations
@transaction.atomic
def create_order_with_items(user, items_data):
    order = Order.objects.create(user=user, total_amount=0)

    total = 0
    for item_data in items_data:
        item = OrderItem.objects.create(
            order=order,
            product_id=item_data['product_id'],
            quantity=item_data['quantity']
        )
        total += item.subtotal

    order.total_amount = total
    order.save()
    return order

# ✅ Nested transactions with savepoints
@transaction.atomic
def process_payment(order):
    try:
        with transaction.atomic():
            order.status = 'processing'
            order.save()
            charge_credit_card(order)
            order.status = 'completed'
            order.save()
    except PaymentError:
        # Rollback to savepoint
        raise

# ❌ Avoid: Manual commit/rollback without transaction context
User.objects.all().delete()  # ← If error occurs after this, not rolled back
```

## Django REST Framework

### Serializers

```python
# ✅ Well-structured serializer with validation
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    orders_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'orders_count']
        read_only_fields = ['id']

    def get_orders_count(self, obj):
        return obj.orders.count()

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value.lower()


# ✅ Nested serializer for relationships
class OrderDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    items = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'user', 'total_amount', 'status', 'items', 'created_at']

    def get_items(self, obj):
        items = obj.items.all()
        return OrderItemSerializer(items, many=True).data


# ✅ Custom field with validation
class StrictEmailField(serializers.EmailField):
    def run_validation(self, data):
        if '@example.com' in data:
            raise serializers.ValidationError("Example emails not allowed")
        return super().run_validation(data)


# ❌ Avoid: Creating N+1 queries in serializers
class BadSerializer(serializers.ModelSerializer):
    orders = serializers.SerializerMethodField()

    def get_orders(self, obj):
        return Order.objects.filter(user=obj).count()  # Query per serialized object!
```

### ViewSets & APIViews

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# ✅ ViewSet with proper methods
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter by authenticated user or admin
        if self.request.user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

    @action(detail=True, methods=['get'])
    def orders(self, request, pk=None):
        user = self.get_object()
        orders = user.orders.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        serializer = UserSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ✅ APIView for custom endpoints
class CustomOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

### Pagination & Filtering

```python
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

# ✅ Custom pagination
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 1000

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'page_size': self.page_size,
            'results': data
        })

# ✅ ViewSet with filtering
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'created_at']
    search_fields = ['user__email', 'id']
    ordering_fields = ['created_at', 'total_amount']
    ordering = ['-created_at']
```

## Async Django Patterns

### Async Views

```python
from django.http import JsonResponse
from asgiref.sync import sync_to_async

# ✅ Async view with database access
async def get_user_async(request, user_id):
    try:
        user = await sync_to_async(User.objects.get)(id=user_id)
        return JsonResponse({
            'id': user.id,
            'email': user.email,
            'name': user.full_name
        })
    except User.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

# ✅ Async view with async operations
async def get_orders_async(request, user_id):
    user = await sync_to_async(User.objects.get)(id=user_id)

    # Fetch orders asynchronously
    orders = await sync_to_async(
        lambda: list(user.orders.all())
    )()

    return JsonResponse({
        'user': user.email,
        'orders': [{'id': o.id, 'total': str(o.total_amount)} for o in orders]
    })

# ❌ Avoid: Blocking database calls in async view
async def bad_async_view(request):
    users = User.objects.all()  # ← Blocking! No await
```

### Async Managers

```python
# ✅ Async-friendly manager
class UserManager(models.Manager):
    async def get_active_users(self):
        return await sync_to_async(self.filter)(is_active=True)

# ✅ Use in async context
async def list_active_users():
    users = await User.objects.get_active_users()
    return [user.email for user in users]
```

## Middleware & Decorators

### Custom Middleware

```python
# ✅ Request/Response middleware
class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Before view
        import logging
        logger = logging.getLogger('requests')
        logger.info(f"{request.method} {request.path} - {request.user}")

        response = self.get_response(request)

        # After view
        logger.info(f"Status: {response.status_code}")
        return response

# ✅ Register in settings.py
MIDDLEWARE = [
    # ...
    'myapp.middleware.RequestLoggingMiddleware',
]
```

### Decorators

```python
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_http_methods

# ✅ View decorator
@require_http_methods(["GET", "POST"])
def user_list_view(request):
    if request.method == 'GET':
        users = User.objects.all()
        return JsonResponse({'users': list(users.values())})
    elif request.method == 'POST':
        # Create user
        pass

# ✅ Class-based view decorator
@method_decorator(require_http_methods(["GET"]), name='dispatch')
class UserDetailView(APIView):
    def get(self, request, pk):
        user = User.objects.get(pk=pk)
        return Response(UserSerializer(user).data)
```

## Testing Patterns

### Unit Tests

```python
from django.test import TestCase, Client
from rest_framework.test import APITestCase

# ✅ Model tests
class UserModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            email='test@example.com',
            first_name='John',
            last_name='Doe'
        )

    def test_full_name(self):
        self.assertEqual(self.user.full_name, 'John Doe')

    def test_email_is_unique(self):
        with self.assertRaises(Exception):
            User.objects.create(
                email='test@example.com',
                first_name='Jane'
            )

# ✅ API tests
class UserAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create(
            email='test@example.com',
            first_name='John'
        )
        self.client = Client()

    def test_list_users(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_create_user(self):
        response = self.client.post('/api/users/', {
            'email': 'new@example.com',
            'first_name': 'Jane'
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(User.objects.count(), 2)

# ✅ Integration tests
class OrderFlowTests(TestCase):
    def test_complete_order_flow(self):
        user = User.objects.create(email='test@example.com')
        order = Order.objects.create(user=user, total_amount=100)

        # Verify order created
        self.assertEqual(order.user, user)
        self.assertEqual(user.orders.count(), 1)
```

## Performance Optimization

### Query Optimization

```python
# ❌ Problem: N+1 queries
for order in Order.objects.all():
    print(order.user.email)  # Query per order

# ✅ Solution: select_related
for order in Order.objects.select_related('user'):
    print(order.user.email)  # No extra query

# ❌ Problem: Loading all data
users = User.objects.all()  # All users in memory

# ✅ Solution: Pagination or iterator
from django.core.paginator import Paginator
paginator = Paginator(User.objects.all(), 50)
for page_num in paginator.page_range:
    users = paginator.get_page(page_num)
```

### Caching

```python
from django.views.decorators.cache import cache_page
from django.core.cache import cache

# ✅ Cache entire view response
@cache_page(60 * 5)  # 5 minutes
def user_list_view(request):
    users = User.objects.all()
    return JsonResponse({'users': list(users.values())})

# ✅ Cache specific queries
def get_active_users():
    cached = cache.get('active_users')
    if cached:
        return cached

    users = User.objects.filter(is_active=True)
    cache.set('active_users', users, 60 * 30)  # 30 minutes
    return users

# ✅ Cache invalidation
def update_user(user_id):
    user = User.objects.get(id=user_id)
    user.is_active = False
    user.save()
    cache.delete('active_users')  # Invalidate cache
```

## Security Best Practices

### CSRF & Authentication

```python
from django.middleware.csrf import csrf_protect
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

# ✅ CSRF protection (enabled by default)
# ✅ Token authentication
from rest_framework.authtoken.models import Token

class UserViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

# ✅ Custom permissions
from rest_framework.permissions import BasePermission

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        return obj.user == request.user
```

### Input Validation

```python
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

# ✅ Form validation
from django import forms

class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name']

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Email already in use")
        return email

# ✅ Serializer validation
class UserSerializer(serializers.ModelSerializer):
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email exists")
        return value.lower()
```

## Configuration Management

### Settings Best Practices

```python
# ✅ settings.py structure
import os
from pathlib import Path
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

# Environment-specific settings
DEBUG = config('DEBUG', default=False, cast=bool)
SECRET_KEY = config('SECRET_KEY')
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost').split(',')

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

# Cache
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': config('REDIS_URL', default='redis://127.0.0.1:6379/1'),
    }
}
```

---

**Skill Version:** 1.0
**Last Updated:** 2026-02-12
**Coverage:** ORM, DRF, Async views, Testing, Performance, Security, Configuration
