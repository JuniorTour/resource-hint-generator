/*
Add resource hint link element, eg: <link rel="prefetch" href="${targetPath}">
*/
try {
  (function (prefetchFilesPath, preconnectDomains) {
    const crossOriginAttrVal = undefined || '';
    const CDN_HOST = 'https://a.com/static/' || window.cdnPath;
    if (!prefetchFilesPath || !prefetchFilesPath.length) {
      return;
    }

    function addLinkTag(src, { rel, crossoriginVal }) {
      const tag = document.createElement('link');
      tag.rel = rel;
      tag.href = src;
      // enable crossorigin so that prefetch cache works for
      // Cross Origin Isolation status.
      if (crossoriginVal !== undefined) {
        tag.setAttribute('crossorigin', crossoriginVal);
      }
      const head = document.querySelector('head');
      if (head && head.appendChild) {
        head.appendChild(tag);
      }
    }

    function addPrefetchDNSTag(src) {
      addLinkTag(src, {
        rel: 'dns-prefetch',
        crossoriginVal: crossOriginAttrVal,
      });
    }

    function addPreconnectTag(src) {
      addLinkTag(src, {
        rel: 'preconnect',
        crossoriginVal: crossOriginAttrVal,
      });
    }

    function addPrefetchTag(src) {
      addLinkTag(src, { rel: 'prefetch', crossoriginVal: crossOriginAttrVal });
    }

    if (prefetchFilesPath && prefetchFilesPath.forEach) {
      prefetchFilesPath.forEach((path) => {
        if (path) {
          addPrefetchTag(CDN_HOST + path);
        }
      });
    }
    if (preconnectDomains && preconnectDomains.forEach) {
      preconnectDomains.forEach((domain) => {
        if (domain) {
          addPreconnectTag(domain);
          addPrefetchDNSTag(domain);
        }
      });
    }
  })(['/a.js',], ['https://b.com',]);
} catch (err) {
  console.log(`[resource-hint.js] ERROR: err=${err}`);
}
