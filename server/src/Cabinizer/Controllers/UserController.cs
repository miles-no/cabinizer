using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Cabinizer.Data;
using Cabinizer.Models;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cabinizer.Controllers
{
    [Route("users")]
    public class UserController : ApiController
    {
        public UserController(CabinizerContext context, Cloudinary cloudinary)
        {
            Context = context;
            Cloudinary = cloudinary;
            MapToModel = x => new UserModel
            {
                Id = x.Id,
                Email = x.Email,
                FullName = x.FullName,
                GivenName = x.GivenName,
                FamilyName = x.FamilyName,
                PhoneNumber = x.PhoneNumber,
                CloudinaryPublicId = x.CloudinaryPublicId,
                OrganizationUnitPath = x.OrganizationUnitPath,
            };
        }

        private CabinizerContext Context { get; }

        private Cloudinary Cloudinary { get; }

        private Expression<Func<User, UserModel>> MapToModel { get; }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserModel>> GetUserById([FromRoute] string id, CancellationToken cancellationToken)
        {
            if (string.Equals(id, "me", StringComparison.OrdinalIgnoreCase))
            {
                // Add a quick way to retrieve the current user information.
                return RedirectToAction(nameof(GetUserById), new { id = User.Id });
            }

            var user = await Context.Users
                .Select(MapToModel)
                .FirstOrDefaultAsync(x => x.Id.Equals(id), cancellationToken);

            if (user is null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserModel>>> GetAllUsers([FromQuery] UserQueryModel model, CancellationToken cancellationToken)
        {
            var query = Context.Users.AsQueryable();

            if (!string.IsNullOrEmpty(model.OrgUnitPath))
            {
                query = query.Where(x => x.OrganizationUnitPath.StartsWith(model.OrgUnitPath));
            }

            var users = await query
                .OrderBy(x => x.FamilyName)
                .ThenBy(x => x.GivenName)
                .Select(MapToModel)
                .ToListAsync(cancellationToken);

            foreach (var user in users)
            {
                user.PictureUrl = Url.ActionLink(nameof(GetUserPictureById), values: new { id = user.Id });
            }

            return Ok(users);
        }

        [HttpGet("{id}/picture")]
        public async Task<ActionResult> GetUserPictureById([FromRoute] string id, [FromQuery] int? size, CancellationToken cancellationToken)
        {
            var user = await Context.Users.FirstOrDefaultAsync(x => x.Id.Equals(id), cancellationToken);

            if (user is null)
            {
                return NotFound();
            }

            if (string.IsNullOrEmpty(user.CloudinaryPublicId))
            {
                // TODO: Fix this placeholder image.
                return Redirect("https://www.miles.no/wp-content/themes/miles/image/male.png");
            }

            var source = Uri.EscapeUriString(user.CloudinaryPublicId);

            var finalSize = size ?? 260;

            var transformation = new Transformation()
                .Gravity("face", "center")
                .FetchFormat("png")
                .Height(finalSize)
                .Width(finalSize)
                .Crop("fill");

            var pictureUrl = Cloudinary.Api.UrlImgUp
                .Transform(transformation).Secure()
                .BuildUrl(source);

            return Redirect(pictureUrl);
        }
    }
}
