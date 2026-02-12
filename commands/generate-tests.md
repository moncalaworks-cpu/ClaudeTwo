---
name: generate-tests
description: Generate idiomatic test code for your framework
argument-hint: "[file] - Source file to generate tests for"
model: sonnet
budget: 3
---

# /generate-tests - Generate Test Code

Automatically create unit and integration tests matching your framework's idioms.

## What it does

1. **Analyzes source** - Reads and understands the code
2. **Generates tests** - Creates appropriate test cases with mocks
3. **Framework idioms** - Uses xUnit/pytest/Jest patterns
4. **Best practices** - Follows AAA pattern, proper naming, edge cases

## Usage

```
/generate-tests src/services/UserService.cs
/generate-tests app/api/users/route.ts
/generate-tests myapp/views.py
```

## Output

**For .NET (xUnit):**

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
    public async Task GetUser_WithValidId_ReturnsUser() { ... }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public async Task GetUser_WithInvalidId_ThrowsException(int id) { ... }
}
```

**For Django (pytest):**

```python
@pytest.mark.django_db
class TestUserService:
    def test_create_user_with_valid_data(self):
        service = UserService()
        user = service.create_user(email='test@example.com')
        assert user.id is not None

    def test_get_user_raises_not_found(self):
        with pytest.raises(User.DoesNotExist):
            UserService().get_user(user_id=999)
```

**For Next.js (Jest + RTL):**

```typescript
describe('UserProfile', () => {
    it('displays user information when loaded', async () => {
        render(<UserProfile userId={1} />);
        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
    });

    it('displays error message on fetch failure', async () => {
        global.fetch = jest.fn(() => Promise.reject(new Error('Network')));
        render(<UserProfile userId={1} />);
        await waitFor(() => {
            expect(screen.getByText(/Error/)).toBeInTheDocument();
        });
    });
});
```

## Includes

- ✅ Unit tests with mocks
- ✅ Happy path and error cases
- ✅ Edge case coverage
- ✅ Integration test examples
- ✅ Mock data fixtures

## References

Uses **testing-patterns** skill for framework-specific patterns.
