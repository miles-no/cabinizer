using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Cabinizer.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Cabinizer
{
    public static class ApplicationBuilderExtensions
    {
        /// <summary>
        /// <para>
        /// Adds a middleware that will get the current user's OrgUnitPath from the database
        /// and add it to the current <see cref="ClaimsPrincipal"/>. The value is cached in
        /// memory to avoid going to the database for every single call to the API.
        /// </para>
        /// <para>
        /// The reason we have to do this is because Google JWT tokens don't contain the OrgUnitPath
        /// which we need for authorization purposes. The alternative would be to set up our own
        /// identity server and start issuing our own tokens, but that comes with a whole heap of
        /// other problems, so we'll stick with this solution for now. 
        /// </para>
        /// </summary>
        public static IApplicationBuilder UseOrgUnitPathEnricher(this IApplicationBuilder app)
        {
            return app.UseMiddleware<OrgUnitPathEnricherMiddleware>();
        }

        private class OrgUnitPathEnricherMiddleware
        {
            public OrgUnitPathEnricherMiddleware(RequestDelegate next, IMemoryCache cache)
            {
                Next = next;
                Cache = cache;
            }

            private RequestDelegate Next { get; }

            private IMemoryCache Cache { get; }

            public async Task Invoke(HttpContext httpContext, CabinizerContext context)
            {
                if (httpContext.User.Identity.IsAuthenticated)
                {
                    var user = new CabinizerPrincipal(httpContext.User);

                    var orgUnitPath = await Cache.GetOrCreateAsync(user.Id, entry => GetOrgUnitPath(entry, context));

                    var identity = new ClaimsIdentity("Cabinizer");

                    identity.AddClaim(new Claim(CustomClaimTypes.OrgUnitPath, orgUnitPath));

                    httpContext.User.AddIdentity(identity);
                }

                await Next(httpContext);
            }

            private static async Task<string> GetOrgUnitPath(ICacheEntry entry, CabinizerContext context)
            {
                var userId = (string) entry.Key;

                var user = await context.Users
                    .Select(x => new { x.Id, OrgUnitPath = x.OrganizationUnitPath })
                    .SingleAsync(x => x.Id.Equals(userId));

                return user.OrgUnitPath;
            }
        }
    }
}
