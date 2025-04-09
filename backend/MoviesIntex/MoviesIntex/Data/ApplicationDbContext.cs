using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.General;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MoviesIntex.Data;

public class ApplicationDbContext : IdentityDbContext<IdentityUser>
{
     public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) :
        base(options)
    {
    }    
}
