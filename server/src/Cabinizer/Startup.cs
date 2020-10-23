using System.Text.Json;
using System.Text.Json.Serialization;
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
using Newtonsoft.Json.Converters;
using NodaTime;
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
            services.AddSwaggerGen(options => options.SchemaFilter<EnumSchemaFilter>());
            services.AddApplicationInsightsTelemetry(Configuration);

            services.AddMemoryCache();
            services.AddProblemDetails();

            services.AddSingleton<IClock>(SystemClock.Instance);
            services.AddScoped<GoogleImportService>();
            services.AddSingleton<GoogleClient>();

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
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.IgnoreNullValues = true;
                    // options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(System.Text.Json, true));
                })
                .ConfigureApiBehaviorOptions(options => options.SuppressMapClientErrors = true)
                .AddApiExplorer();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
            });
            
            app.UseProblemDetails();

            if (!env.IsDevelopment())
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors();
            app.UseAuthentication();
            app.UseOrgUnitPathEnricher();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
