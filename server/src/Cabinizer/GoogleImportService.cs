using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using Cabinizer.Data;
using Google.Apis.Admin.Directory.directory_v1.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using User = Cabinizer.Data.User;

namespace Cabinizer
{
    public class GoogleImportService
    {
        static GoogleImportService()
        {
            IgnoreOrgUnitPaths = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "/Sluttet", Constants.RootOrganizationUnitPath };
        }

        public GoogleImportService(GoogleClient google, CabinizerContext context, IHostEnvironment environment, ILogger<GoogleImportService> logger)
        {
            Google = google;
            Context = context;
            Logger = logger;
            FileProvider = environment.ContentRootFileProvider;
        }

        private GoogleClient Google { get; }

        private CabinizerContext Context { get; }

        private ILogger<GoogleImportService> Logger { get; }

        private IFileProvider FileProvider { get; }

        private static HashSet<string> IgnoreOrgUnitPaths { get; }

        public async Task ImportUsersAsync(CancellationToken cancellationToken)
        {
            try
            {
                await ImportOrgUnits(cancellationToken);

                var mapping = await ReadCloudinaryMapping(FileProvider, cancellationToken);

                await ImportUsers(mapping, cancellationToken);
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

                var orgUnit = await Context.OrganizationUnits.FirstOrDefaultAsync(x => x.Path.Equals(googleOrgUnit.OrgUnitPath), cancellationToken);

                if (orgUnit is null)
                {
                    orgUnit = new OrganizationUnit
                    {
                        Path = googleOrgUnit.OrgUnitPath
                    };

                    await Context.OrganizationUnits.AddAsync(orgUnit, cancellationToken);
                }

                orgUnit.Name = googleOrgUnit.Name.TrimStart('_');
                orgUnit.ParentPath = googleOrgUnit.ParentOrgUnitPath;
            }

            var count = await Context.SaveChangesAsync(cancellationToken);

            Logger.LogInformation("Imported {OrgUnitCount} org units from Google.", count);
        }

        private async Task ImportUsers(IReadOnlyDictionary<string, string> publicIds, CancellationToken cancellationToken)
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

                var user = await Context.Users.FirstOrDefaultAsync(x => x.Id.Equals(googleUser.Id), cancellationToken);

                if (user is null)
                {
                    user = new User
                    {
                        Id = googleUser.Id
                    };

                    await Context.Users.AddAsync(user, cancellationToken);
                }

                user.Email = googleUser.PrimaryEmail;
                user.GivenName = googleUser.Name.GivenName;
                user.FamilyName = googleUser.Name.FamilyName;
                user.FullName = googleUser.Name.FullName;
                user.OrganizationUnitPath = googleUser.OrgUnitPath;
                user.PhoneNumber = NormalizePhoneNumber(googleUser.Phones);

                if (publicIds.TryGetValue(googleUser.Id, out var publicId))
                {
                    user.CloudinaryPublicId = publicId;
                }
            }

            var count = await Context.SaveChangesAsync(cancellationToken);

            Logger.LogInformation("Imported {UserCount} user(s) from Google.", count);
        }

        private static string NormalizePhoneNumber(IEnumerable<UserPhone> phones)
        {
            var phoneNumber = phones.OrderBy(x => x.Primary).Select(x => x.Value).FirstOrDefault();

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

        private async Task<IReadOnlyDictionary<string, string>> ReadCloudinaryMapping(IFileProvider fileProvider, CancellationToken cancellationToken)
        {
            var result = new Dictionary<string, string>();

            await foreach (var (key, value) in ReadMappingFile(fileProvider, cancellationToken))
            {
                result.Add(key, value);
            }

            return result;
        }

        private async IAsyncEnumerable<KeyValuePair<string, string>> ReadMappingFile(IFileProvider fileProvider, [EnumeratorCancellation] CancellationToken cancellationToken)
        {
            const string fileName = "user_mapping.csv";

            var file = fileProvider.GetFileInfo(fileName);

            if (!file.Exists)
            {
                Logger.LogInformation("Could not find Cloudinary mapping file '{MappingFileName}'.", fileName);
                yield break;
            }

            using var reader = new StreamReader(file.CreateReadStream());

            while (true)
            {
                var line = await reader.ReadLineAsync();

                if (string.IsNullOrEmpty(line))
                {
                    yield break;
                }

                var parts = line.Split(';');

                if (parts.Length != 2)
                {
                    Logger.LogWarning("Invalid Cloudinary mapping: {Mapping}", line);
                    continue;
                }

                yield return new KeyValuePair<string, string>(parts[0], parts[1]);
            }
        }
    }
}
