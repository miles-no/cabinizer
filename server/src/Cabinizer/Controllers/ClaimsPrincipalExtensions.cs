using System.Diagnostics.CodeAnalysis;
using System.Security.Claims;

namespace Cabinizer.Controllers
{
    public static class ClaimsPrincipalExtensions
    {
        public delegate bool TryParseClass<T>(string value, out T result);

        public static T ParseFirstValue<T>(this ClaimsPrincipal principal, string claimType, TryParseClass<T> parser)
        {
            var value = principal.FindFirstValue(claimType);

            if (string.IsNullOrEmpty(value))
            {
                return default!;
            }

            if (parser(value, out var result))
            {
                return result;
            }

            return default!;
        }
    }
}
