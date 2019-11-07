using Cabinizer.Data;
using CloudinaryDotNet;
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
                    policy.AllowAnyHeader();
                    policy.WithOrigins(Configuration.GetSection("Cors:Origins").Get<string[]>());
                    policy.WithMethods(HttpMethods.Get, HttpMethods.Put, HttpMethods.Post, HttpMethods.Delete);
                });
            });

            services.AddApplicationInsightsTelemetry(Configuration);

            services.AddMemoryCache();
            services.AddProblemDetails();

            services.AddSingleton<GoogleClient>();
            services.AddScoped<GoogleUserImportService>();

            services.AddSingleton(x =>
            {
                var cloudinary = Configuration.GetSection("Cloudinary");

                var account = new Account(cloudinary["Cloud"], cloudinary["ApiKey"], cloudinary["ApiSecret"]);

                return new Cloudinary(account);
            });

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.UseGoogle(
                        clientId: Configuration["Auth:Google:ClientId"],
                        hostedDomain: Configuration["Auth:Google:HostedDomain"]);
                });

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

            services.AddMvcCore()
                .AddJsonOptions(options => options.JsonSerializerOptions.IgnoreNullValues = true)
                .ConfigureApiBehaviorOptions(options => options.SuppressMapClientErrors = true);
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
            app.UseOrganizationUnitEnricher();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
