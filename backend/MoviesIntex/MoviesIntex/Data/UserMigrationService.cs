using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MoviesIntex.Data;
using System.Linq;
using System.Threading.Tasks;

public class UserMigrationService
{
    private readonly MovieDbContext _movieContext;
    private readonly UserManager<IdentityUser> _userManager;

    public UserMigrationService(MovieDbContext movieContext, UserManager<IdentityUser> userManager)
    {
        _movieContext = movieContext;
        _userManager = userManager;
    }

    public async Task MigrateUsersAsync()
    {
        // Get users from Movies.db with IDs 2-200
        var users = await _movieContext.MovieUsers
            .Where(u => u.UserId >= 2 && u.UserId <= 200)
            .ToListAsync();

        foreach (var user in users)
        {
            var email = user.Email;
            var password = GeneratePassword(user.Name); // Generate password
            var identityUser = new IdentityUser
            {
                UserName = email,
                Email = email
            };

            // Check if the user already exists in IdentityDb
            var existingUser = await _userManager.FindByEmailAsync(email);
            if (existingUser == null)
            {
                // Create user in IdentityDb
                var result = await _userManager.CreateAsync(identityUser, password);
                if (result.Succeeded)
                {
                    Console.WriteLine($"User {user.Name} created successfully!");
                }
                else
                {
                    Console.WriteLine($"Error creating user {user.Name}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                }
            }
        }
    }

    private string GeneratePassword(string fullName)
    {
        // List of titles to remove (e.g., MD, Jr., etc.)
        var titlesToRemove = new List<string> { "MD", "Jr.", "III", "II", "Sr.", "Esq." };
        
        var nameParts = fullName.Split(' '); // Split full name into parts
        var filteredParts = nameParts.Where(part => !titlesToRemove.Contains(part)).ToList(); // Remove titles

        if (filteredParts.Count >= 2) // If we have both first and last names
        {
            var firstName = Capitalize(filteredParts[0]);
            var lastName = Capitalize(filteredParts[1]);
            
            return $"{firstName}{lastName}1234!"; // Generate password
        }

        // Fallback: in case the name doesn't have both first and last name
        return $"{fullName.Replace(" ", "")}1234!"; // Combine name and add password suffix
    }

    private string Capitalize(string name)
    {
        if (string.IsNullOrEmpty(name))
            return name;

        return char.ToUpper(name[0]) + name.Substring(1).ToLower();
    }
}
