// Template: ASP.NET Core API Controller
// Usage: Copy and customize for your domain model

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using YourNamespace.Services;
using YourNamespace.DTOs;

namespace YourNamespace.Controllers
{
    /// <summary>
    /// API controller for [Entity] management.
    ///
    /// Endpoints:
    /// - GET /api/[entity]         - List all [entities]
    /// - GET /api/[entity]/{id}    - Get single [entity]
    /// - POST /api/[entity]        - Create [entity]
    /// - PUT /api/[entity]/{id}    - Update [entity]
    /// - DELETE /api/[entity]/{id} - Delete [entity]
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class [Entity]Controller : ControllerBase
    {
        private readonly I[Entity]Service _service;
        private readonly ILogger<[Entity]Controller> _logger;

        public [Entity]Controller(I[Entity]Service service, ILogger<[Entity]Controller> logger)
        {
            _service = service;
            _logger = logger;
        }

        /// <summary>
        /// Get all [entities] with optional filtering and pagination.
        /// </summary>
        /// <param name="page">Page number (default: 1)</param>
        /// <param name="pageSize">Items per page (default: 50)</param>
        /// <returns>Paginated list of [entity] DTOs</returns>
        [HttpGet]
        [ProduceResponseType(typeof(PagedResult<[Entity]Dto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PagedResult<[Entity]Dto>>> GetAll(int page = 1, int pageSize = 50)
        {
            _logger.LogInformation("Fetching [entities] - Page: {Page}, PageSize: {PageSize}", page, pageSize);

            try
            {
                var result = await _service.GetAsync(page, pageSize);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning("Invalid parameters for GetAll: {Error}", ex.Message);
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Get a single [entity] by ID.
        /// </summary>
        /// <param name="id">The [entity] ID</param>
        /// <returns>The [entity] DTO</returns>
        [HttpGet("{id}")]
        [ProduceResponseType(typeof([Entity]Dto), StatusCodes.Status200OK)]
        [ProduceResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<[Entity]Dto>> GetById(int id)
        {
            _logger.LogInformation("Fetching [entity] with ID: {Id}", id);

            var entity = await _service.GetByIdAsync(id);
            if (entity is null)
            {
                _logger.LogWarning("[Entity] not found: {Id}", id);
                return NotFound(new { error = "[Entity] not found" });
            }

            return Ok(entity);
        }

        /// <summary>
        /// Create a new [entity].
        /// </summary>
        /// <param name="request">Create request DTO</param>
        /// <returns>Created [entity] DTO</returns>
        [HttpPost]
        [ProduceResponseType(typeof([Entity]Dto), StatusCodes.Status201Created)]
        [ProduceResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<[Entity]Dto>> Create([FromBody] Create[Entity]Request request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _logger.LogInformation("Creating [entity]");

            try
            {
                var result = await _service.CreateAsync(request);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError("Create [entity] failed: {Error}", ex.Message);
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Update an existing [entity].
        /// </summary>
        /// <param name="id">The [entity] ID</param>
        /// <param name="request">Update request DTO</param>
        /// <returns>Updated [entity] DTO</returns>
        [HttpPut("{id}")]
        [ProduceResponseType(typeof([Entity]Dto), StatusCodes.Status200OK)]
        [ProduceResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<[Entity]Dto>> Update(int id, [FromBody] Update[Entity]Request request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _logger.LogInformation("Updating [entity] with ID: {Id}", id);

            try
            {
                var result = await _service.UpdateAsync(id, request);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError("Update [entity] failed: {Error}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Delete a [entity] by ID.
        /// </summary>
        /// <param name="id">The [entity] ID</param>
        [HttpDelete("{id}")]
        [ProduceResponseType(StatusCodes.Status204NoContent)]
        [ProduceResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            _logger.LogInformation("Deleting [entity] with ID: {Id}", id);

            try
            {
                await _service.DeleteAsync(id);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError("Delete [entity] failed: {Error}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
        }
    }
}
