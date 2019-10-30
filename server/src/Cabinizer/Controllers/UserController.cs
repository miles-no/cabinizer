using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Cabinizer.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cabinizer.Controllers
{
    [Route("users")]
    public class UserController : ApiController
    {
        public UserController(CabinizerContext context, GoogleClient google)
        {
            Context = context;
            Google = google;
        }

        private CabinizerContext Context { get; }

        private GoogleClient Google { get; }

        [HttpGet("{id}", Name = nameof(GetUser))]
        public async Task<ActionResult<User>> GetUser([FromRoute] string id, CancellationToken cancellationToken)
        {
            // Provide a quick way to get the info of the logged in user.
            if (string.Equals(id, "me", StringComparison.OrdinalIgnoreCase))
            {
                id = User.Id;
            }

            var user = await Context.Users.SingleOrDefaultAsync(x => x.Id.Equals(id), cancellationToken);

            if (user is null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<User>> CreateUser([FromQuery] string accessToken, CancellationToken cancellationToken)
        {
            var userId = User.Id;

            var redirectUrl = Url.Action(nameof(GetUser), new { id = userId });

            var user = await Context.Users.SingleOrDefaultAsync(x => x.Id.Equals(userId), cancellationToken);

            if (user is object)
            {
                return Redirect(redirectUrl);
            }

            return await CreateUser(accessToken, redirectUrl, cancellationToken);
        }

        private async Task<ActionResult<User>> CreateUser(string accessToken, string url, CancellationToken cancellationToken)
        {
            var phoneNumbers = await Google.GetPhoneNumbers(accessToken, cancellationToken);

            if (phoneNumbers.Count == 0)
            {
                return StatusCode(StatusCodes.Status502BadGateway);
            }

            var phoneNumber = phoneNumbers
                .OrderBy(x => x.IsVerified)
                .ThenBy(x => x.IsPrimary)
                .First();

            var user = new User
            {
                Id = User.Id,
                GivenName = User.GivenName,
                FamilyName = User.FamilyName,
                PictureUrl = User.PictureUrl.ToString(),
                Email = User.Email,
                IsEmailVerified = User.IsEmailVerified,
                PhoneNumber = phoneNumber.Value,
                IsPhoneNumberVerified = phoneNumber.IsVerified,
            };

            await Context.AddAsync(user, cancellationToken);

            await Context.SaveChangesAsync(cancellationToken);

            return Created(url, user);
        }
    }
}