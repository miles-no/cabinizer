using System.Threading;
using System.Threading.Tasks;
using Cabinizer.Data;
using Microsoft.EntityFrameworkCore;

namespace Cabinizer
{
    public static class SeedExtensions
    {
        public static async Task SeedAsync(this CabinizerContext context, CancellationToken cancellationToken = default)
        {
            // Bail out early if there's already data in the database.
            if (await context.Users.AnyAsync(cancellationToken))
            {
                return;
            }

            context.CurrentUser = CabinizerPrincipal.System;

            var rootOrgUnit = new OrganizationUnit
            {
                Path = Constants.RootOrganizationUnitPath,
                Name = "Miles",
            };

            await context.OrganizationUnits.AddAsync(rootOrgUnit, cancellationToken);

            var systemUser = new User
            {
                Id = Constants.SystemUserId,
                GivenName = "System",
                FamilyName = "User",
                FullName = "System User",
                PhoneNumber = "+4712345678",
                Email = "miles.drift@miles.no",
                OrganizationUnitPath = Constants.RootOrganizationUnitPath,
            };

            await context.Users.AddAsync(systemUser, cancellationToken);

            await context.SaveChangesAsync(cancellationToken);
        }
    }
}
