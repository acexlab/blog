using BlogApi.Data;
using BlogApi.DTOs;
using BlogApi.Models;
using BlogApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;


namespace BlogApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BlogController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Authorize]

        [HttpPost]
        public async Task<IActionResult> CreateBlog(CreateBlogDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized();
            }

            var blog = new Blog
            {
                Title = dto.Title,
                Content = dto.Content,
                UserId = int.Parse(userId)
            };

            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Blog created successfully." });
        }
        [HttpGet]
    public async Task<IActionResult> GetBlogs()
    {
        var blogs = await _context.Blogs
            .Include(b => b.User)
            .Select(b => new ViewBlogDTO
            {
                Id = b.Id,
                Title = b.Title,
                Content = b.Content,
                AuthorId = b.UserId,
                AuthorName = b.User.Name
            })
            .ToListAsync();

        return Ok(blogs);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetBlog(int id)
    {
        var blog = await _context.Blogs
            .Include(b => b.User)
            .Where(b => b.Id == id)
            .Select(b => new ViewBlogDTO
            {
                Id = b.Id,
                Title = b.Title,
                Content = b.Content,
                AuthorId = b.UserId,
                AuthorName = b.User.Name
            })
            .FirstOrDefaultAsync();

        if (blog == null)
        {
            return NotFound("Blog not found.");
        }

        return Ok(blog);
    }
    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBlog(int id, UpdateBlogDTO dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }

        var blog = await _context.Blogs.FindAsync(id);
        if (blog == null)
        {
            return NotFound("Blog not found.");
        }

        if (blog.UserId != int.Parse(userId))
        {
            return Forbid();
        }

        blog.Title = dto.Title;
        blog.Content = dto.Content;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Blog updated successfully." });
    }
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBlog(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }

        var blog = await _context.Blogs.FindAsync(id);
        if (blog == null)
        {
            return NotFound("Blog not found.");
        }

        if (blog.UserId != int.Parse(userId))
        {
            return Forbid();
        }

        _context.Blogs.Remove(blog);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Blog deleted successfully." });
    }
}
}