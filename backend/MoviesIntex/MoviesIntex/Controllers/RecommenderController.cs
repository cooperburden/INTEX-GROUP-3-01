using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace MoviesIntex.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecommenderController : ControllerBase
    {
        [HttpGet("{userId}")]
        public IActionResult GetRecommendations(int userId)
        {
            var scriptPath = "Models/checkpickle.py"; // adjust path if needed
            var pythonExecutable = "python3"; // or "python" on Windows

            var startInfo = new ProcessStartInfo
            {
                FileName = pythonExecutable,
                Arguments = $"{scriptPath} {userId}",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            try
            {
                using var process = new Process();
                process.StartInfo = startInfo;
                process.Start();

                string output = process.StandardOutput.ReadToEnd();
                string error = process.StandardError.ReadToEnd();

                process.WaitForExit();

                if (!string.IsNullOrEmpty(error))
                {
                    return StatusCode(500, new { message = "Python error", error });
                }

                return Ok(output);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error", exception = ex.Message });
            }
        }
    }
}