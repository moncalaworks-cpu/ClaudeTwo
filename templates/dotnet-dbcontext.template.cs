// Template: EF Core DbContext
// Usage: Copy and customize for your entities

using Microsoft.EntityFrameworkCore;
using YourNamespace.Models;

namespace YourNamespace.Data
{
    /// <summary>
    /// Entity Framework Core database context for your application.
    /// </summary>
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Add your DbSet properties here
        // public DbSet<[Entity]> [Entities] { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure [Entity]
            modelBuilder.Entity<[Entity]>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.HasIndex(e => e.Email)
                    .IsUnique();

                // Relationships
                // entity.HasMany(e => e.Orders)
                //     .WithOne(o => o.User)
                //     .HasForeignKey(o => o.UserId)
                //     .OnDelete(DeleteBehavior.Cascade);

                // Indexes
                entity.HasIndex(e => e.CreatedAt)
                    .IsDescending();
            });

            // Seed data (optional)
            // modelBuilder.Entity<[Entity]>().HasData(
            //     new [Entity] { Id = 1, Email = "admin@example.com" }
            // );
        }
    }
}
