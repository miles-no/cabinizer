using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Cabinizer.Data;
using Microsoft.Extensions.Logging;

namespace Cabinizer
{
    public class GoogleUserImportService
    {
        static GoogleUserImportService()
        {
            IgnoreOrgUnitPaths = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "/Sluttet", "/" };
        }

        public GoogleUserImportService(GoogleClient google, CabinizerContext context, ILogger<GoogleUserImportService> logger)
        {
            Google = google;
            Context = context;
            Logger = logger;
        }

        private GoogleClient Google { get; }

        private CabinizerContext Context { get; }

        private ILogger<GoogleUserImportService> Logger { get; }

        private static HashSet<string> IgnoreOrgUnitPaths { get; }

        public async Task ImportUsersAsync(CancellationToken cancellationToken)
        {
            try
            {
                await ImportOrgUnits(cancellationToken);
                await ImportUsers(cancellationToken);
            }
            catch (Exception e)
            {
                Logger.LogWarning(e, "Failed to import users from Google.");
            }
        }

        private async Task ImportOrgUnits(CancellationToken cancellationToken)
        {
            await foreach (var googleOrgUnit in Google.GetOrgUnitsAsync(cancellationToken))
            {
                if (IgnoreOrgUnitPaths.Contains(googleOrgUnit.OrgUnitPath))
                {
                    Logger.LogDebug("Skipping organization unit {OrgUnitPath}.", googleOrgUnit.OrgUnitPath);
                    continue;
                }

                var orgUnit = new OrganizationUnit
                {
                    Path = googleOrgUnit.OrgUnitPath,
                    Name = googleOrgUnit.Name.TrimStart('_'),
                    ParentPath = googleOrgUnit.ParentOrgUnitPath,
                };

                await Context.OrganizationUnits.AddAsync(orgUnit, cancellationToken);
            }

            var rootOrgUnit = new OrganizationUnit
            {
                Path = "/",
                Name = "Miles",
            };

            await Context.OrganizationUnits.AddAsync(rootOrgUnit, cancellationToken);

            var count = await Context.SaveChangesAsync(cancellationToken);

            Logger.LogInformation("Imported {OrgUnitCount} org units from Google.", count);
        }

        private async Task ImportUsers(CancellationToken cancellationToken)
        {
            await foreach (var googleUser in Google.GetUsersAsync(cancellationToken))
            {
                if (string.IsNullOrEmpty(googleUser.OrgUnitPath))
                {
                    Logger.LogDebug("Skipping user '{UserId}' with missing organization unit.", googleUser.Id);
                    continue;
                }

                if (IgnoreOrgUnitPaths.Contains(googleUser.OrgUnitPath))
                {
                    Logger.LogDebug("Skipping user '{UserId}' in {OrgUnitPath} organization unit.", googleUser.Id, googleUser.OrgUnitPath);
                    continue;
                }

                var phoneNumber = googleUser.Phones
                    .OrderBy(x => x.Primary)
                    .Select(x => x.Value)
                    .FirstOrDefault();

                var user = new User
                {
                    Id = googleUser.Id,
                    Email = googleUser.PrimaryEmail,
                    GivenName = googleUser.Name.GivenName,
                    FamilyName = googleUser.Name.FamilyName,
                    PictureUrl = googleUser.ThumbnailPhotoUrl,
                    OrganizationUnitPath = googleUser.OrgUnitPath,
                    PhoneNumber = NormalizePhoneNumber(phoneNumber),
                };

                await Context.Users.AddAsync(user, cancellationToken);
            }

            var count = await Context.SaveChangesAsync(cancellationToken);

            Logger.LogInformation("Imported {UserCount} user(s) from Google.", count);
        }

        private static string NormalizePhoneNumber(string phoneNumber)
        {
            if (string.IsNullOrEmpty(phoneNumber))
            {
                return phoneNumber;
            }

            if (!phoneNumber.StartsWith('+'))
            {
                // We just assume that numbers missing country codes are Norwegian.
                phoneNumber = "+47" + phoneNumber;
            }

            // Some phone numbers have non-breaking space instead of regular space.
            return phoneNumber.Replace('\u00a0', ' ').Replace(" ", string.Empty);
        }
    }
}
