using Microsoft.EntityFrameworkCore;

namespace MoviesIntex.Data
{
    public class MovieDbContext : DbContext
    {
        public MovieDbContext(DbContextOptions<MovieDbContext> options)
            : base(options)
        {
        }
        
        public DbSet<MovieTitle> MovieTitles { get; set; }
        public DbSet<MovieRating> MovieRatings { get; set; }
        public DbSet<MovieUser> MovieUsers { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MovieRating>()
                .HasKey(mr => new { mr.UserId, mr.ShowId });
        }
        
    }
}