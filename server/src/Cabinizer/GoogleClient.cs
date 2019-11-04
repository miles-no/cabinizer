using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Threading;
using Google.Apis.Admin.Directory.directory_v1;
using Google.Apis.Admin.Directory.directory_v1.Data;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Microsoft.Extensions.Configuration;
using User = Google.Apis.Admin.Directory.directory_v1.Data.User;

namespace Cabinizer
{
    public class GoogleClient
    {
        private const string AdminUserEmail = "miles.ga.admin@miles.no";

        private const string Customer = "my_customer";

        private static readonly string[] Scopes =
        {
            DirectoryService.Scope.AdminDirectoryUserReadonly,
            DirectoryService.Scope.AdminDirectoryOrgunitReadonly,
        };

        public GoogleClient(IConfiguration configuration)
        {
            var secretsJson = configuration["GoogleSecrets"];

            if (string.IsNullOrEmpty(secretsJson))
            {
                return;
            }

            var credential = LoadCredential(secretsJson).CreateWithUser(AdminUserEmail);

            Initializer = new BaseClientService.Initializer
            {
                HttpClientInitializer = credential,
                ApplicationName = "Miles Events"
            };
        }

        private BaseClientService.Initializer? Initializer { get; }

        public async IAsyncEnumerable<User> GetUsersAsync([EnumeratorCancellation] CancellationToken cancellationToken)
        {
            if (Initializer is null)
            {
                yield break;
            }

            using var service = new DirectoryService(Initializer);

            var request = service.Users.List();

            request.MaxResults = 200;
            request.Customer = Customer;

            var response = await request.ExecuteAsync(cancellationToken);

            foreach (var user in response.UsersValue)
            {
                yield return user;
            }

            while (!string.IsNullOrEmpty(response.NextPageToken))
            {
                request.PageToken = response.NextPageToken;

                response = await request.ExecuteAsync(cancellationToken);

                foreach (var user in response.UsersValue)
                {
                    yield return user;
                }
            }
        }

        public async IAsyncEnumerable<OrgUnit> GetOrgUnitsAsync([EnumeratorCancellation] CancellationToken cancellationToken)
        {
            if (Initializer is null)
            {
                yield break;
            }

            using var service = new DirectoryService(Initializer);

            var hasFetchedRootOrgUnit = false;

            var response = await service.Orgunits
                .List(Customer)
                .ExecuteAsync(cancellationToken);

            foreach (var orgUnit in response.OrganizationUnits)
            {
                if (!hasFetchedRootOrgUnit && orgUnit.ParentOrgUnitPath.Equals("/"))
                {
                    yield return await service.Orgunits
                        .Get(Customer, orgUnit.ParentOrgUnitId)
                        .ExecuteAsync(cancellationToken);

                    hasFetchedRootOrgUnit = true;
                }

                yield return orgUnit;
            }
        }

        private static GoogleCredential LoadCredential(string json)
        {
            return GoogleCredential.FromJson(json).CreateScoped(Scopes);
        }
    }
}
