﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web.Http.Dispatcher;
using Bit.WebApi.Contracts;

namespace Bit.WebApi.Implementations
{
    public class DefaultWebApiAssembliesResolver : IAssembliesResolver
    {
        private readonly IEnumerable<IApiAssembliesProvider> _apiAssembliesProviders;

        private ICollection<Assembly> _result;

#if DEBUG
        protected DefaultWebApiAssembliesResolver()
        {
        }
#endif

        public DefaultWebApiAssembliesResolver(IEnumerable<IApiAssembliesProvider> apiAssembliesProviders)
        {
            if (apiAssembliesProviders == null)
                throw new ArgumentNullException(nameof(apiAssembliesProviders));

            _apiAssembliesProviders = apiAssembliesProviders;
        }

        public virtual ICollection<Assembly> GetAssemblies()
        {
            if (_result == null)
            {
                _result = _apiAssembliesProviders
                    .SelectMany(asmProvider => asmProvider.GetApiAssemblies())
                    .ToList();
            }

            return _result;
        }
    }
}