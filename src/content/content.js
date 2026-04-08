chrome.storage.local.get(["blockedSites"], (result) => {
  const sites = result.blockedSites || [];
  if (sites.length === 0) return;

  const current = window.location.hostname;

  const isBlocked = sites.some((site) => {
    // legacy check
    if (typeof site === 'string') return current.includes(site);
    
    // new check
    return current.includes(site.domain) && site.blockUntil > Date.now();
  });

  if (isBlocked) {
    const url = chrome.runtime.getURL("blocked.html");
    window.location.replace(url);
  }
});
