using System.Data.Common;
using System.Text.Json;
using Hellang.Middleware.ProblemDetails;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Npgsql;

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
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.WithOrigins(Configuration.GetSection("Cors:Origins").Get<string[]>());
                    policy.WithHeaders(Configuration.GetSection("Cors:Headers").Get<string[]>());
                    policy.WithMethods(HttpMethods.Get, HttpMethods.Put, HttpMethods.Post, HttpMethods.Delete);
                });
            });

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

            services.AddEntityFrameworkNpgsql();
            services.AddEntityFrameworkNpgsqlNodaTime();

            var builder = new NpgsqlConnectionStringBuilder(Configuration.GetConnectionString("Default"))
            {
                Password = Configuration["DbPassword"]
            };

            services.AddDbContext<CabinizerContext>(x => x.UseNpgsql(builder.ConnectionString, y => y.UseNodaTime()));

            services.AddMvcCore().AddJsonOptions(x =>
            {
                x.JsonSerializerOptions.IgnoreNullValues = true;
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseProblemDetails();

            if (!env.IsDevelopment())
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
