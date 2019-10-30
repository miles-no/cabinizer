using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;

namespace Cabinizer
{
    public class GoogleClient
    {
        private static readonly Uri GoogleApiUri = new Uri("https://people.googleapis.com/v1/people/me?personFields=phoneNumbers");

        public GoogleClient(HttpClient client, ILogger<GoogleClient> logger)
        {
            Client = client;
            Logger = logger;
        }

        private HttpClient Client { get; }

        private ILogger<GoogleClient> Logger { get; }

        public async Task<IReadOnlyCollection<PhoneNumber>> GetPhoneNumbers(string accessToken, CancellationToken cancellationToken = default)
        {
            if (accessToken == null)
            {
                throw new ArgumentNullException(nameof(accessToken));
            }

            using var request = new HttpRequestMessage(HttpMethod.Get, GoogleApiUri);

            request.Headers.Add(HeaderNames.Authorization, $"Bearer {accessToken}");

            using var response = await Client.SendAsync(request, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                Logger.LogWarning("Failed to fetch phone numbers from Google.");
                return Array.Empty<PhoneNumber>();
            }

            await using var stream = await response.Content.ReadAsStreamAsync();
            using var payload = await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);

            if (payload.RootElement.TryGetProperty("phoneNumbers", out var element))
            {
                return ParsePhoneNumbers(element).ToList();
            }

            return Array.Empty<PhoneNumber>();
        }

        private static IEnumerable<PhoneNumber> ParsePhoneNumbers(JsonElement element)
        {
            foreach (var phoneNumber in element.EnumerateArray())
            {
                var canonicalForm = phoneNumber.GetProperty("canonicalForm").GetString();

                var metadata = phoneNumber.GetProperty("metadata");

                var isVerified = metadata.GetProperty("verified").GetBoolean();
                var isPrimary = metadata.GetProperty("primary").GetBoolean();

                yield return new PhoneNumber(canonicalForm, isVerified, isPrimary);
            }
        }

        public class PhoneNumber
        {
            public PhoneNumber(string value, bool isVerified, bool isPrimary)
            {
                Value = value;
                IsVerified = isVerified;
                IsPrimary = isPrimary;
            }

            public string Value { get; }

            public bool IsVerified { get; }

            public bool IsPrimary { get; }
        }
    }
}