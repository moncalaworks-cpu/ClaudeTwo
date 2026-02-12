---
name: generate-component
description: Generate framework-specific component or model scaffolding
argument-hint: "[name] [type] - Component name and type (controller,view,component,model,service)"
model: haiku
---

# /generate-component - Scaffold Components

Generate boilerplate code for controllers, views, components, models, and services.

## What it does

1. **Generates scaffold** - Creates framework-appropriate boilerplate
2. **Follows conventions** - Uses framework naming and structure patterns
3. **Includes samples** - Provides example methods and properties
4. **Ready to extend** - Clean structure ready for customization

## Usage

```
/generate-component UserController controller        # .NET controller
/generate-component user_service service             # Django service
/generate-component UserProfile component            # Next.js component
/generate-component User model                       # Database model
```

## Output Examples

**.NET ASP.NET Core Controller:**

```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _service;

    public UsersController(IUserService service) => _service = service;

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id) { }

    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateUser(CreateUserRequest request) { }
}
```

**Django REST Framework ViewSet:**

```python
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)
```

**Next.js React Component:**

```typescript
"use client";

import { useState, useEffect } from "react";

interface Props {
  userId: number;
}

export function UserProfile({ userId }: Props) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Implementation...
}
```

**Django Model:**

```python
class User(models.Model):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
```

## Includes

- ✅ Proper class/function structure
- ✅ Type hints and interfaces
- ✅ Dependency injection setup
- ✅ Example methods with signatures
- ✅ Docstring/comment templates
- ✅ Framework conventions

## References

Uses **dotnet-expert**, **django-expert**, **nextjs-expert** skills.
