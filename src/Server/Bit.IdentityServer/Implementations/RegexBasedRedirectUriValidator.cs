﻿using Bit.Core.Contracts;
using IdentityServer3.Core.Models;
using IdentityServer3.Core.Services;
using IdentityServer3.Core.Services.Default;
using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Bit.Core.Models;

namespace Bit.IdentityServer.Implementations
{
    public class RegexBasedRedirectUriValidator : DefaultRedirectUriValidator, IRedirectUriValidator
    {
        private readonly AppEnvironment _activeAppEnvironment;

        public RegexBasedRedirectUriValidator(IAppEnvironmentProvider appEnvironmentProvider)
        {
            if (appEnvironmentProvider == null)
                throw new ArgumentNullException(nameof(appEnvironmentProvider));

            _activeAppEnvironment = appEnvironmentProvider.GetActiveAppEnvironment();
        }

#if DEBUG
        protected RegexBasedRedirectUriValidator()
        {
        }
#endif

        public override async Task<bool> IsPostLogoutRedirectUriValidAsync(string requestedUri, Client client)
        {
            return _activeAppEnvironment.DebugMode == true ||
                (await base.IsPostLogoutRedirectUriValidAsync(requestedUri, client).ConfigureAwait(false)) ||
                client.PostLogoutRedirectUris.Any(rUri => Regex.IsMatch(requestedUri, rUri, RegexOptions.Compiled | RegexOptions.IgnoreCase | RegexOptions.IgnorePatternWhitespace | RegexOptions.CultureInvariant));
        }

        public override async Task<bool> IsRedirectUriValidAsync(string requestedUri, Client client)
        {
            return _activeAppEnvironment.DebugMode == true ||
                (await base.IsRedirectUriValidAsync(requestedUri, client).ConfigureAwait(false)) ||
                client.RedirectUris.Any(rUri => Regex.IsMatch(requestedUri, rUri, RegexOptions.Compiled | RegexOptions.IgnoreCase | RegexOptions.IgnorePatternWhitespace | RegexOptions.CultureInvariant));
        }
    }
}
