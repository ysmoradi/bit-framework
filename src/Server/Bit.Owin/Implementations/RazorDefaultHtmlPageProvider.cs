﻿using System;
using System.Threading;
using System.Threading.Tasks;
using Bit.Core.Contracts;
using Bit.Owin.Contracts;
using Microsoft.Owin;
using RazorEngine;
using RazorEngine.Templating;

namespace Bit.Owin.Implementations
{
    public class RazorDefaultHtmlPageProvider : IDefaultHtmlPageProvider
    {
        private readonly IOwinContext _owinContext;

#if DEBUG
        protected RazorDefaultHtmlPageProvider()
        {
        }
#endif

        public RazorDefaultHtmlPageProvider(IOwinContext owinContext)
        {
            if (owinContext == null)
                throw new ArgumentNullException(nameof(owinContext));

            _owinContext = owinContext;
        }

        public virtual Task<string> GetDefaultPageAsync(CancellationToken cancellationToken)
        {
            return Task.FromResult(Engine.Razor.Run("defaultPageTemplate", typeof(IDependencyResolver),
                _owinContext.GetDependencyResolver()));
        }

        public virtual string GetDefaultPage()
        {
            return Engine.Razor.Run("defaultPageTemplate", typeof(IDependencyResolver),
                _owinContext.GetDependencyResolver());
        }
    }
}