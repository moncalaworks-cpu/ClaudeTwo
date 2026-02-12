# .NET/C# Expert Skill

Comprehensive knowledge of C#, ASP.NET Core, Entity Framework Core, and MS SQL Server patterns.

## Language Features & Best Practices

### Async/Await Patterns

```csharp
// ✅ Correct: ConfigureAwait(false) in libraries
public async Task<User> GetUserAsync(int id)
{
    using var db = new AppDbContext();
    return await db.Users
        .FirstOrDefaultAsync(u => u.Id == id)
        .ConfigureAwait(false);
}

// ✅ Correct: Exception handling with async
public async Task<Result> ProcessAsync(Data data)
{
    try
    {
        return await ServiceAsync(data).ConfigureAwait(false);
    }
    catch (OperationCanceledException) when (!CancellationToken.None.IsCancellationRequested)
    {
        // Log and retry
        return Result.Failed("Operation cancelled");
    }
}

// ❌ Avoid: Not using ConfigureAwait in libraries
await Task.Delay(100); // Can cause deadlock in UI apps

// ❌ Avoid: Fire-and-forget without tracking
#pragma warning disable CS4014
DoSomethingAsync(); // ← Dangerous, will crash silently
```

### Nullability & Null Coalescing

```csharp
// ✅ Enable nullable reference types in csproj
<Nullable>enable</Nullable>

// ✅ Use null-coalescing operator
string name = user?.FirstName ?? "Unknown";

// ✅ Use null-coalescing assignment
user ??= new User { Id = Guid.NewGuid() };

// ✅ Pattern matching with null checks
if (user is not null && user.IsActive)
{
    await user.ProcessAsync();
}
```

### Dependency Injection (DI)

```csharp
// ✅ Service registration in Program.cs
var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddScoped<IUserService, UserService>()
    .AddSingleton<ICacheService, MemoryCacheService>()
    .AddTransient<IEmailService, EmailService>();

var app = builder.Build();

// ✅ Constructor injection in controllers
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }
}

// ❌ Avoid: Service locator pattern
var service = ServiceLocator.GetService<IUserService>();

// ❌ Avoid: Static dependencies
public static IUserService UserService { get; set; } // ← Testing nightmare
```

### LINQ Best Practices

```csharp
// ✅ Use AsNoTracking for read-only queries
var users = await db.Users
    .AsNoTracking()
    .Where(u => u.IsActive)
    .ToListAsync();

// ✅ Projection to DTO (avoid selecting entities)
var userDtos = await db.Users
    .Select(u => new UserDto
    {
        Id = u.Id,
        Name = u.Name
    })
    .ToListAsync();

// ❌ Avoid: N+1 queries
var users = db.Users.ToList(); // ← Loads all users
foreach (var user in users)
{
    var orders = db.Orders.Where(o => o.UserId == user.Id).ToList(); // ← Query per user!
}

// ✅ Correct: Use Include or SelectMany
var users = await db.Users
    .Include(u => u.Orders)
    .ToListAsync();
```

### Records & Value Types

```csharp
// ✅ Use records for immutable DTOs
public record CreateUserRequest(string Email, string FirstName, string LastName);

public record UserDto(int Id, string Email, string Name);

// ✅ Record with validation
public record Password(string Value)
{
    public Password(string value) : this(ValidatePassword(value)) { }

    private static string ValidatePassword(string pwd)
    {
        if (string.IsNullOrEmpty(pwd) || pwd.Length < 8)
            throw new ArgumentException("Password must be at least 8 characters");
        return pwd;
    }
}

// ✅ Use value objects for domain concepts
public class UserId : IEquatable<UserId>
{
    public int Value { get; }
    public UserId(int value) => Value = value;

    public bool Equals(UserId? other) => other?.Value == Value;
    public override bool Equals(object? obj) => Equals(obj as UserId);
    public override int GetHashCode() => Value.GetHashCode();
}
```

## Entity Framework Core

### DbContext Configuration

```csharp
// ✅ Proper DbContext setup
public class AppDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Order> Orders { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("connection_string");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasMany(e => e.Orders).WithOne(o => o.User).HasForeignKey(o => o.UserId);
        });
    }
}

// ✅ Dependency injection for DbContext
services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("Default"))
        .EnableSensitiveDataLogging(isDevelopment)
);

// ❌ Avoid: DbContext in static field
public static AppDbContext? Context { get; set; } // ← Thread-unsafe
```

### Query Patterns

```csharp
// ✅ Filtering and pagination
public async Task<PagedResult<UserDto>> GetUsersAsync(int page, int pageSize)
{
    var query = db.Users.AsNoTracking().Where(u => u.IsActive);

    var total = await query.CountAsync();
    var users = await query
        .OrderBy(u => u.CreatedAt)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .Select(u => new UserDto(u.Id, u.Email, u.FullName))
        .ToListAsync();

    return new PagedResult<UserDto>(users, total, page, pageSize);
}

// ✅ Eager loading with Include
var orders = await db.Orders
    .Include(o => o.User)
    .Include(o => o.Items)
    .ThenInclude(i => i.Product)
    .Where(o => o.CreatedAt > DateTime.UtcNow.AddDays(-30))
    .ToListAsync();

// ❌ Avoid: Multiple queries for related data
var order = db.Orders.First();
var user = db.Users.First(u => u.Id == order.UserId); // ← Separate query
```

### Migrations

```csharp
// ✅ Add migration with description
dotnet ef migrations add AddUserTable

// ✅ Migration naming convention
// TIMESTAMP_BRIEF_DESCRIPTION.cs
// Example: 20260212_AddUserTable.cs

// ✅ Review migration before applying
dotnet ef migrations script

// ✅ Apply migrations automatically
app.MigrateDatabase(); // Call in Program.cs

// ❌ Avoid: Manual SQL migrations
// ← Use EF Core migrations for consistency
```

## ASP.NET Core API Design

### Minimal APIs

```csharp
// ✅ Modern minimal API pattern
app.MapPost("/api/users", CreateUser)
    .WithName("CreateUser")
    .WithOpenApi()
    .Produces<UserDto>(StatusCodes.Status201Created)
    .Produces(StatusCodes.Status400BadRequest)
    .WithValidation();

async Task<IResult> CreateUser(CreateUserRequest request, IUserService service)
{
    var user = await service.CreateUserAsync(request);
    return Results.Created($"/api/users/{user.Id}", user);
}

// ✅ Fluent API configuration
app.MapGet("/api/users/{id}")
    .WithName("GetUser")
    .WithOpenApi()
    .Produces<UserDto>()
    .Produces(StatusCodes.Status404NotFound)
    .RequireAuthorization()
    .WithValidation();
```

### Controllers

```csharp
// ✅ Proper controller pattern
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _service;

    public UsersController(IUserService service) => _service = service;

    [HttpGet("{id}")]
    [ProduceResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProduceResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await _service.GetUserAsync(id);
        if (user is null) return NotFound();
        return Ok(user);
    }

    [HttpPost]
    [ProduceResponseType(typeof(UserDto), StatusCodes.Status201Created)]
    [ProduceResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserDto>> CreateUser(CreateUserRequest request)
    {
        var user = await _service.CreateUserAsync(request);
        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
    }
}
```

### Error Handling

```csharp
// ✅ Global exception handling middleware
app.UseExceptionHandler(exceptionHandlerApp =>
{
    exceptionHandlerApp.Run(async context =>
    {
        var exception = context.Features.Get<IExceptionHandlerPathFeature>()?.Error;

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = exception switch
        {
            ValidationException => StatusCodes.Status400BadRequest,
            NotFoundException => StatusCodes.Status404NotFound,
            _ => StatusCodes.Status500InternalServerError
        };

        await context.Response.WriteAsJsonAsync(new { error = exception?.Message });
    });
});

// ✅ Custom exception types
public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message) { }
}

public class ValidationException : Exception
{
    public ValidationException(string message) : base(message) { }
}
```

## Testing Patterns (xUnit)

### Unit Tests

```csharp
// ✅ Arrange-Act-Assert pattern
public class UserServiceTests
{
    private readonly UserService _service;
    private readonly Mock<IRepository<User>> _repository;

    public UserServiceTests()
    {
        _repository = new Mock<IRepository<User>>();
        _service = new UserService(_repository.Object);
    }

    [Fact]
    public async Task GetUser_WithValidId_ReturnsUser()
    {
        // Arrange
        var userId = 1;
        var user = new User { Id = userId, Email = "test@example.com" };
        _repository.Setup(r => r.GetByIdAsync(userId))
            .ReturnsAsync(user);

        // Act
        var result = await _service.GetUserAsync(userId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(userId, result.Id);
        _repository.Verify(r => r.GetByIdAsync(userId), Times.Once);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public async Task GetUser_WithInvalidId_ThrowsException(int invalidId)
    {
        // Arrange & Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _service.GetUserAsync(invalidId));
    }
}

// ✅ Integration tests with test database
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
                        options.UseSqlite("Data Source=:memory:"));
                });
            });
    }

    public async Task InitializeAsync()
    {
        _client = _factory.CreateClient();
        // Setup test data
    }

    public async Task DisposeAsync()
    {
        _client?.Dispose();
        _factory?.Dispose();
    }
}
```

## Performance Optimization

### Common Issues & Solutions

```csharp
// ❌ Problem: N+1 queries
foreach (var order in orders)
{
    var items = db.OrderItems.Where(i => i.OrderId == order.Id).ToList();
}

// ✅ Solution: Eager load with Include
var orders = db.Orders
    .Include(o => o.Items)
    .ToList();

// ❌ Problem: Large dataset in memory
var allUsers = db.Users.ToList(); // ← All users loaded

// ✅ Solution: Stream or paginate
var users = db.Users.AsAsyncEnumerable(); // Streaming
// OR
var page = db.Users.Skip(pageNum * pageSize).Take(pageSize);

// ❌ Problem: Synchronous database calls
var user = db.Users.FirstOrDefault(u => u.Id == id); // ← Blocks thread

// ✅ Solution: Use async
var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id);
```

### Caching Patterns

```csharp
// ✅ Memory cache with expiration
services.AddMemoryCache();

public class CachedUserService
{
    private readonly IMemoryCache _cache;
    private readonly IUserRepository _repository;

    public async Task<User> GetUserAsync(int id)
    {
        if (_cache.TryGetValue($"user_{id}", out User? cached))
            return cached;

        var user = await _repository.GetByIdAsync(id);
        _cache.Set($"user_{id}", user, TimeSpan.FromMinutes(30));
        return user;
    }
}

// ✅ Distributed cache
services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = configuration.GetConnectionString("Redis");
});
```

## Security Best Practices

### Authentication & Authorization

```csharp
// ✅ JWT authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = configuration["Jwt:Audience"],
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]))
        };
    });

// ✅ Role-based authorization
[Authorize(Roles = "Admin")]
public async Task<IActionResult> DeleteUser(int id) { }

[Authorize(Policy = "CanManageUsers")]
public async Task<IActionResult> ManageUser(int id) { }

// ❌ Avoid: Storing secrets in code
private const string ApiKey = "sk-abc123"; // ← Use configuration!
```

### Input Validation

```csharp
// ✅ Data annotations
public class CreateUserRequest
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    [StringLength(255, MinimumLength = 5)]
    public string Email { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string FirstName { get; set; }
}

// ✅ Fluent validation
public class CreateUserRequestValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format");

        RuleFor(x => x.FirstName)
            .NotEmpty()
            .MinimumLength(2)
            .MaximumLength(100);
    }
}

// ✅ Validate in minimal API
app.MapPost("/api/users", CreateUser)
    .WithValidation();
```

## Configuration Management

### appsettings.json Pattern

```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost;Database=MyApp;Integrated Security=true;"
  },
  "Jwt": {
    "Issuer": "MyApp",
    "Audience": "MyAppUsers",
    "Key": "[generated-key]",
    "ExpirationMinutes": 60
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

```csharp
// ✅ Options pattern
public class JwtOptions
{
    public string Issuer { get; set; }
    public string Audience { get; set; }
    public string Key { get; set; }
    public int ExpirationMinutes { get; set; }
}

builder.Services.Configure<JwtOptions>(configuration.GetSection("Jwt"));

// Inject IOptions<JwtOptions> into services
```

---

**Skill Version:** 1.0
**Last Updated:** 2026-02-12
**Coverage:** Async/await, DI, EF Core, ASP.NET Core APIs, Testing, Performance, Security, Configuration
