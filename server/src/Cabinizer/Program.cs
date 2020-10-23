using System;
using System.Threading;
using System.Threading.Tasks;
using Cabinizer.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Cabinizer
{
    public static class Program
    {
        public static async Task Main(string[] args)
        {
            using var host = CreateHostBuilder(args).Build();

            await host.SeedDatabase();

            await host.RunAsync();
        }

        private static async Task SeedDatabase(this IHost host)
        {
            using var scope = host.Services.CreateScope();

            await using var context = scope.ServiceProvider.GetRequiredService<CabinizerContext>();

            await context.Database.EnsureDeletedAsync();

            await context.Database.EnsureCreatedAsync();

            var google = scope.ServiceProvider.GetRequiredService<GoogleImportService>();

            await SeedData(context, google);
        }

        private static async Task SeedData(CabinizerContext context, GoogleImportService google)
        {
            context.CurrentUser = CabinizerPrincipal.System;

            var rootOrgUnit = new OrganizationUnit
            {
                Path = Constants.RootOrganizationUnitPath,
                Name = "Miles",
            };

            await context.OrganizationUnits.AddAsync(rootOrgUnit);

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

            await context.Users.AddAsync(systemUser);

            await google.ImportUsersAsync(CancellationToken.None);

            var cabin = new Item
            {
                Id = new Guid("01042e92-a3ca-46f7-85ba-0f223f97224a"),
                OrganizationUnitPath = "/",
                Name = "Hytte, Tj�rhom Panorama",
                AdminUserId = Constants.SystemUserId,
            };

            await context.Items.AddAsync(cabin);

            await context.SaveChangesAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(x => x.UseStartup<Startup>());
    }
}
