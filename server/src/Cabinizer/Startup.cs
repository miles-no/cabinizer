using System.Text.Json;
using Hellang.Authentication.JwtBearer.Google;
using Hellang.Middleware.ProblemDetails;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Cabinizer
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        private IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddProblemDetails();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(x => x.UseGoogle(
                    clientId: Configuration["Auth:Google:ClientId"],
                    hostedDomain: Configuration["Auth:Google:HostedDomain"]));

            services.AddAuthorization(options =>
            {
                options.FallbackPolicy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();
            });

            services.AddMvcCore();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseProblemDetails();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/", context =>
                {
                    context.Response.ContentType = "application/json";

                    var writer = new Utf8JsonWriter(context.Response.BodyWriter);

                    writer.WriteStartObject();

                    foreach (var claim in context.User.Claims)
                    {
                        writer.WriteString(claim.Type, claim.Value);
                    }

                    writer.WriteEndObject();

                    return writer.FlushAsync();
                });
            });
        }
    }
}
