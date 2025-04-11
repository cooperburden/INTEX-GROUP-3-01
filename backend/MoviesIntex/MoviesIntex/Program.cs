using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MoviesIntex.Data;
using MoviesIntex.Services;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;


var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddRazorPages();


builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});


void RunCheckPickleScript()
{
    // Set up the process start info for Python script execution
    ProcessStartInfo start = new ProcessStartInfo();
    start.FileName = "python"; // Make sure Python is available in your PATH
    start.Arguments = "checkpickle.py"; // Set the correct path to your checkpickle.py
    start.WorkingDirectory = "Models"; // Optional: set working directory if needed

    Process process = Process.Start(start);
}

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("MovieConnection")));

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("IdentityConnection")));

builder.Services.AddAuthorization();

builder.Services.AddScoped<UserMigrationService>();

builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
    {
        options.SignIn.RequireConfirmedAccount = false;

        // ✅ Stronger password rules (for your assignment)
        options.Password.RequireDigit = false;
        options.Password.RequiredLength = 12;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireLowercase = false;
    })
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier;
    options.ClaimsIdentity.UserNameClaimType = ClaimTypes.Email; // Use email as user identity
});

// Optional, only needed if you want to customize claims later
builder.Services.AddScoped<IUserClaimsPrincipalFactory<IdentityUser>, CustomUserClaimsPrincipalFactory>();

builder.Services.AddCors(options =>
   {
       options.AddPolicy("AllowFrontend",
           policy =>
           {
               policy.WithOrigins("https://white-grass-03804941e.6.azurestaticapps.net") // Your React frontend
                   .AllowCredentials()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
           });
   });

var app = builder.Build();

// app.Use(async (context, next) =>
//{
  //  context.Response.Headers.Append("Content-Security-Policy",
    //    "default-src 'self'; " +
      //  "script-src 'self' https://trusted.cdn.com 'unsafe-inline'; " +
        //"style-src 'self' https://trusted.cdn.com 'unsafe-inline'; " +
    //    "img-src 'self' data: https://trusted.image-host.com; " +
      //  "font-src 'self' https://trusted.font-cdn.com; " +
        //"connect-src 'self' https://localhost:5000 http://localhost:3000 http://localhost:4000");

  //  await next();
//});

// Dev tools
  app.UseSwagger();
  app.UseSwaggerUI();


app.UseRouting(); // ✅ Required before CORS and auth

app.UseCors("AllowFrontend"); // ✅ Enable credentials-safe CORS

app.UseAuthentication(); // ✅ Must follow CORS
app.UseAuthorization();

app.UseHttpsRedirection();

app.MapControllers();
app.MapRazorPages();

// 👇 Logout endpoint
app.MapPost("/logout", async (HttpContext context, SignInManager<IdentityUser> signInManager) =>
{
    await signInManager.SignOutAsync();
    context.Response.Cookies.Delete(".AspNetCore.Identity.Application");
    return Results.Ok(new { message = "Logout successful" });
});

// 👇 Check if logged in
app.MapGet("/pingauth", (ClaimsPrincipal user) =>
{
    if (!user.Identity?.IsAuthenticated ?? false)
    {
        return Results.Unauthorized();
    }

    var email = user.FindFirstValue(ClaimTypes.Email) ?? "unknown@example.com";
    return Results.Json(new { email = email });
}).RequireAuthorization();

app.MapGet("/test-csp", () =>
{
    return Results.Text("<html><head></head><body><h1>Hello CSP</h1></body></html>", "text/html");
});














// Run the user migration on startup
using (var scope = app.Services.CreateScope())
{
    var userMigrationService = scope.ServiceProvider.GetRequiredService<UserMigrationService>();
    await userMigrationService.MigrateUsersAsync(); // This will run the migration
}

// Run the Python script to start the recommendation models
RunCheckPickleScript(); // This will execute the Python script before the app fully runs

app.Run(); // Start the application
