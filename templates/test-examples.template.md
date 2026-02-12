# Test Templates for All Frameworks

## .NET (xUnit + Moq) Test Template

File: `Tests/Services/[Entity]ServiceTests.cs`

```csharp
using Xunit;
using Moq;
using YourNamespace.Services;
using YourNamespace.Models;
using YourNamespace.Repositories;

public class [Entity]ServiceTests
{
    private readonly Mock<I[Entity]Repository> _mockRepository;
    private readonly [Entity]Service _service;

    public [Entity]ServiceTests()
    {
        _mockRepository = new Mock<I[Entity]Repository>();
        _service = new [Entity]Service(_mockRepository.Object);
    }

    [Fact]
    public async Task Create[Entity]_WithValidData_ReturnsCreated[Entity]()
    {
        // Arrange
        var request = new Create[Entity]Request { Name = "Test", Email = "test@example.com" };
        var expected = new [Entity] { Id = 1, Name = "Test" };

        _mockRepository
            .Setup(r => r.AddAsync(It.IsAny<[Entity]>()))
            .ReturnsAsync(expected);

        // Act
        var result = await _service.Create[Entity](request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(expected.Id, result.Id);
        _mockRepository.Verify(r => r.AddAsync(It.IsAny<[Entity]>()), Times.Once);
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public async Task Create[Entity]_WithInvalidName_ThrowsException(string name)
    {
        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(
            () => _service.Create[Entity](new Create[Entity]Request { Name = name })
        );
    }
}
```

## Django (pytest) Test Template

File: `tests/test_views.py`

```python
import pytest
from django.test import Client
from django.contrib.auth.models import User
from myapp.models import [Entity]

@pytest.mark.django_db
class TestCreate[Entity]API:
    @pytest.fixture
    def client(self):
        return Client()

    @pytest.fixture
    def user(self, db):
        return User.objects.create_user(email='test@example.com', password='secure123')

    @pytest.fixture
    def auth_headers(self, user):
        return {'HTTP_AUTHORIZATION': f'Bearer {user.auth_token}'}

    def test_create_[entity]_with_valid_data(self, client, auth_headers):
        # Arrange
        data = {'name': 'Test', 'email': 'new@example.com'}

        # Act
        response = client.post('/api/[entities]/', data, **auth_headers)

        # Assert
        assert response.status_code == 201
        assert [Entity].objects.count() == 1
        assert [Entity].objects.first().name == 'Test'

    def test_create_[entity]_requires_authentication(self, client):
        # Act
        response = client.post('/api/[entities]/', {})

        # Assert
        assert response.status_code == 401

    @pytest.mark.parametrize('field,value', [
        ('name', ''),
        ('email', 'invalid'),
        ('name', None),
    ])
    def test_create_[entity]_with_invalid_data(self, client, user, field, value, auth_headers):
        # Arrange
        data = {'name': 'Test', 'email': 'test@example.com', field: value}

        # Act
        response = client.post('/api/[entities]/', data, **auth_headers)

        # Assert
        assert response.status_code == 400
```

## Next.js (Jest + RTL) Test Template

File: `__tests__/components/[Entity]List.test.tsx`

```typescript
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { [Entity]List } from '@/components/[Entity]List';

describe('[Entity]List Component', () => {
    beforeEach(() => {
        // Mock fetch
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('displays loading state initially', () => {
        (global.fetch as jest.Mock).mockImplementation(
            () => new Promise(() => {}) // Never resolves
        );

        render(<[Entity]List />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('displays [entities] when data is loaded', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve([
                { id: 1, name: '[Entity] 1' },
                { id: 2, name: '[Entity] 2' },
            ]),
        });

        render(<[Entity]List />);

        await waitFor(() => {
            expect(screen.getByText('[Entity] 1')).toBeInTheDocument();
            expect(screen.getByText('[Entity] 2')).toBeInTheDocument();
        });
    });

    it('deletes [entity] when delete button clicked', async () => {
        const user = userEvent.setup();

        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([
                    { id: 1, name: '[Entity] 1' },
                ]),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ id: 1 }),
            });

        render(<[Entity]List />);

        await waitFor(() => {
            expect(screen.getByText('[Entity] 1')).toBeInTheDocument();
        });

        // Mock window.confirm
        window.confirm = jest.fn(() => true);

        const deleteButton = screen.getByRole('button', { name: /delete/i });
        await user.click(deleteButton);

        expect(global.fetch).toHaveBeenCalledWith(
            '/api/[entities]/1',
            expect.objectContaining({ method: 'DELETE' })
        );
    });

    it('displays error when fetch fails', async () => {
        (global.fetch as jest.Mock).mockRejectedValue(
            new Error('Network error')
        );

        render(<[Entity]List />);

        await waitFor(() => {
            expect(screen.getByText(/error/i)).toBeInTheDocument();
        });
    });
});
```

## Key Testing Patterns

### All Frameworks

1. **Arrange-Act-Assert (AAA)**
   - Setup test data and mocks
   - Execute code being tested
   - Verify results

2. **Naming Convention**
   - `test[Method]_[Scenario]_[Expected]`
   - Example: `testCreate[Entity]_WithInvalidEmail_ThrowsException`

3. **Edge Cases to Test**
   - Happy path (normal operation)
   - Invalid input (null, empty, wrong type)
   - Boundary conditions
   - Error scenarios
   - Authentication/Authorization

4. **Coverage Goals**
   - Aim for 80-90% code coverage
   - Focus on business logic, not getters/setters
   - Test public interfaces, not private methods
