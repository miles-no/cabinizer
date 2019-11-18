using System;
using System.Security.Claims;
using Hellang.Authentication.JwtBearer.Google;

namespace Cabinizer
{
    public class CabinizerPrincipal : ClaimsPrincipal
    {
        static CabinizerPrincipal()
        {
            var identity = new ClaimsIdentity("System");

            identity.AddClaim(new Claim(GoogleClaimTypes.Sub, Constants.SystemUserId));

            var principal = new ClaimsPrincipal(identity);

            System = new CabinizerPrincipal(principal);
        }

        public CabinizerPrincipal(ClaimsPrincipal inner) : base(inner)
        {
            Inner = inner;
        }

        private ClaimsPrincipal Inner { get; }

        public static CabinizerPrincipal System { get; }

        public string Id => Inner.FindFirstValue(GoogleClaimTypes.Sub);
        
        public string GivenName => Inner.FindFirstValue(GoogleClaimTypes.GivenName);

        public string FamilyName => Inner.FindFirstValue(GoogleClaimTypes.FamilyName);

        public string Email => Inner.FindFirstValue(GoogleClaimTypes.Email);

        public bool IsEmailVerified => Inner.ParseFirstValue<bool>(GoogleClaimTypes.EmailVerified, bool.TryParse);

        public Uri? PictureUrl => Inner.ParseFirstValue<Uri?>(GoogleClaimTypes.Picture, TryParseUri);

        public string OrgUnitPath => Inner.FindFirstValue(CustomClaimTypes.OrgUnitPath);

        private static bool TryParseUri(string value, out Uri? result) => Uri.TryCreate(value, UriKind.Absolute, out result);
    }
}
