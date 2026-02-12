# Testing Patterns Skill

Testing strategies for .NET (xUnit), Django (pytest), and Next.js (Jest).

## Testing Pyramid

```
          /\
         /  \  E2E Tests (5%)
        /    \
       /______\
       /\      \
      /  \  Integration (15%)
     /    \
    /______\
    /\      \
   /  \ Unit Tests (80%)
  /    \
 /______\
```

## .NET Testing (xUnit + Moq)

### Unit Tests

```csharp
public class UserServiceTests
{
    private readonly Mock<IRepository<User>> _mockRepo;
    private readonly UserService _service;

    public UserServiceTests()
    {
        _mockRepo = new Mock<IRepository<User>>();
        _service = new UserService(_mockRepo.Object);
    }

    [Fact]
    public async Task GetUser_WithValidId_ReturnsUser()
    {
        // Arrange
        var userId = 1;
        var user = new User { Id = userId, Email = "test@example.com" };
        _mockRepo.Setup(r => r.GetByIdAsync(userId))
            .ReturnsAsync(user);

        // Act
        var result = await _service.GetUserAsync(userId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(userId, result.Id);
        _mockRepo.Verify(r => r.GetByIdAsync(userId), Times.Once);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public async Task GetUser_WithInvalidId_ThrowsException(int invalidId)
    {
        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(
            () => _service.GetUserAsync(invalidId)
        );
    }
}
```

### Integration Tests

```csharp
public class UserControllerIntegrationTests : IAsyncLifetime
{
    private readonly WebApplicationFactory<Program> _factory;
    private HttpClient _client;

    public UserControllerIntegrationTests()
    {
        _factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    services.AddDbContext<AppDbContext>(options =>
                        options.UseInMemoryDatabase("test-db")
                    );
                });
            });
    }

    public async Task InitializeAsync()
    {
        _client = _factory.CreateClient();
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await db.Database.EnsureCreatedAsync();
    }

    [Fact]
    public async Task CreateUser_WithValidData_Returns201()
    {
        var response = await _client.PostAsJsonAsync("/api/users", new
        {
            email = "test@example.com",
            firstName = "John",
            lastName = "Doe"
        });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var result = await response.Content.ReadAsAsync<UserDto>();
        Assert.NotNull(result.Id);
    }

    public async Task DisposeAsync()
    {
        _client?.Dispose();
        _factory?.Dispose();
    }
}
```

## Django Testing (pytest + pytest-django)

### Unit Tests

```python
import pytest
from django.contrib.auth.models import User
from myapp.services import UserService

@pytest.mark.django_db
class TestUserService:
    def test_create_user_with_valid_data(self):
        # Arrange
        service = UserService()

        # Act
        user = service.create_user(
            email='test@example.com',
            first_name='John',
            password='secure123'
        )

        # Assert
        assert user.id is not None
        assert user.email == 'test@example.com'
        assert User.objects.count() == 1

    def test_get_user_raises_not_found(self):
        # Act & Assert
        with pytest.raises(User.DoesNotExist):
            UserService().get_user(user_id=999)

    @pytest.mark.parametrize('email', [
        'test@example.com',
        'another@example.com'
    ])
    def test_create_user_with_different_emails(self, email):
        service = UserService()
        user = service.create_user(email=email, password='secure123')
        assert user.email == email
```

### Integration Tests

```python
import pytest
from django.test import Client

@pytest.mark.django_db
class TestUserAPI:
    @pytest.fixture
    def client(self):
        return Client()

    @pytest.fixture
    def user(self, db):
        return User.objects.create_user(
            email='test@example.com',
            password='secure123'
        )

    def test_list_users_returns_200(self, client):
        response = client.get('/api/users/')
        assert response.status_code == 200

    def test_create_user_returns_201(self, client):
        response = client.post('/api/users/', {
            'email': 'new@example.com',
            'first_name': 'Jane',
            'password': 'secure123'
        })
        assert response.status_code == 201
        assert User.objects.count() == 1

    def test_get_user_requires_authentication(self, client, user):
        response = client.get(f'/api/users/{user.id}/')
        # Assuming endpoint requires auth
        assert response.status_code in [401, 403]
```

## Next.js Testing (Jest + React Testing Library)

### Component Tests

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
    it('displays loading state initially', () => {
        render(<UserProfile userId={1} />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('displays user information when loaded', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    id: 1,
                    name: 'John Doe',
                    email: 'john@example.com'
                })
            })
        );

        render(<UserProfile userId={1} />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        expect(global.fetch).toHaveBeenCalledWith('/api/users/1');
    });

    it('displays error message on fetch failure', async () => {
        global.fetch = jest.fn(() =>
            Promise.reject(new Error('Network error'))
        );

        render(<UserProfile userId={1} />);

        await waitFor(() => {
            expect(screen.getByText(/Error/)).toBeInTheDocument();
        });
    });

    it('handles user interaction', async () => {
        const user = userEvent.setup();
        render(<LoginForm />);

        const emailInput = screen.getByLabelText('Email');
        const submitButton = screen.getByRole('button', { name: 'Login' });

        await user.type(emailInput, 'test@example.com');
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Login successful')).toBeInTheDocument();
        });
    });
});
```

### API Route Tests

```typescript
import { POST } from "@/app/api/users/route";
import { NextRequest } from "next/server";

describe("POST /api/users", () => {
  it("creates user with valid data", async () => {
    const request = new NextRequest("http://localhost:3000/api/users", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        name: "Test User",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.id).toBeDefined();
    expect(data.email).toBe("test@example.com");
  });

  it("returns 400 for missing fields", async () => {
    const request = new NextRequest("http://localhost:3000/api/users", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
```

## Test Organization

### File Structure

```
.NET:
MyProject/
  MyProject.Tests/
    Unit/
      Services/
        UserServiceTests.cs
    Integration/
      Controllers/
        UserControllerTests.cs

Django:
myproject/
  tests/
    unit/
      test_services.py
    integration/
      test_views.py
    conftest.py

Next.js:
app/
  __tests__/
    components/
      UserProfile.test.tsx
    api/
      users.test.ts
```

## Testing Best Practices

### AAA Pattern (Arrange-Act-Assert)

```
1. ARRANGE: Set up test data and mocks
2. ACT: Execute the code being tested
3. ASSERT: Verify the results
```

### What to Test

```
✅ Happy paths (normal usage)
✅ Edge cases (empty, null, boundary values)
✅ Error conditions (invalid input)
✅ State changes
❌ Don't test: Library code, trivial getters/setters
```

### Mocking Strategy

```
✅ Mock external dependencies (API, database)
✅ Mock time-dependent functions
❌ Don't: Mock the code you're testing
❌ Don't: Over-mock (use real objects when possible)
```

### Test Coverage Goals

```
Ideal targets:
- Unit tests: 80-90% coverage
- Integration tests: 20-30% coverage
- E2E tests: Critical user flows

Commands:
.NET: dotnet test /p:CollectCoverage=true
Django: pytest --cov=myapp
Next.js: npm test -- --coverage
```

## CI/CD Testing

```yaml
# GitHub Actions example
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Run unit tests
        run: |
          # .NET
          dotnet test --no-build --verbosity normal
          # Django
          pytest tests/
          # Next.js
          npm test

      - name: Run integration tests
        run: |
          # Integration test commands

      - name: Upload coverage
        run: |
          # Upload to codecov.io or similar
```

---

**Skill Version:** 1.0
**Last Updated:** 2026-02-12
**Coverage:** Unit tests, Integration tests, Mocking, Coverage, CI/CD
