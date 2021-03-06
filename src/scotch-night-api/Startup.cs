﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SeattleScotchSociety.ScotchNight.Api.Data;

namespace SeattleScotchSociety.ScotchNight.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            string domain = $"https://{Configuration["Auth0:Domain"]}/";

            var connectionString = Configuration.GetConnectionString("ScotchNightDatabase");

            services.AddSingleton<IBottleStore>(p => new SqlBottleStore(connectionString))
                    .AddSingleton<IMemberStore>(p => new SqlMemberStore(connectionString))
                    .AddSingleton<IEventStore>(p => new SqlEventStore(connectionString))
                    .AddSingleton<INoteStore>(p => new SqlNoteStore(connectionString))
                    .AddSingleton<ILocationStore>(p => new SqlLocationStore(connectionString));

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            }).AddJwtBearer(options =>
            {
                options.Authority = domain;
                options.Audience = Configuration["Auth0:ApiIdentifier"];
            });

            services.AddCors();
            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseAuthentication();
            app.UseCors(builder =>
                builder.WithOrigins("http://localhost:8080", "https://scotchnightweb.azurewebsites.net/")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
            );
            app.UseMvc();
        }
    }
}
