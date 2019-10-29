using System;
using System.Threading.Tasks;
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

            using var scope = host.Services.CreateScope();

            await using var context = scope.ServiceProvider.GetRequiredService<CabinizerContext>();

            await context.Database.EnsureDeletedAsync();

            await context.Database.EnsureCreatedAsync();

            await context.Items.AddAsync(new Item
            {
                Id = Guid.NewGuid(),
                Name = "Hytte Tjørhom Panorama",
            });

            await context.SaveChangesAsync();

            await host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(x => x.UseStartup<Startup>());
    }
}
