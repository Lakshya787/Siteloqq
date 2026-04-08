chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["blockedSites"], (result) => {
    if (!result.blockedSites) {
      chrome.storage.local.set({ blockedSites: [] });
    }
  });
});

// Get sites and filter out expired blocks automatically
function getSites(callback) {
  chrome.storage.local.get(["blockedSites"], (result) => {
    let sites = result.blockedSites || [];
    
    // In case of old data format (strings), filter them out or convert them
    sites = sites.filter(s => typeof s === 'object' && s !== null);

    const now = Date.now();
    const activeSites = sites.filter(s => s.blockUntil > now);
    
    // If some sites expired and were removed, save the updated list
    if (activeSites.length !== sites.length) {
      setSites(activeSites, () => {
        callback(activeSites);
      });
    } else {
      callback(activeSites);
    }
  });
}

// Save sites
function setSites(sites, callback) {
  chrome.storage.local.set({ blockedSites: sites }, () => {
    callback && callback(sites);
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.type === "ADD_SITE") {
    getSites((sites) => {
      // payload will be { domain: "example.com", days: 3, hours: 2 }
      const { domain, days = 0, hours = 0 } = message.payload;
      const blockUntil = Date.now() + (((days * 24) + hours) * 60 * 60 * 1000);
      
      const existingIdx = sites.findIndex(s => s.domain === domain);
      if (existingIdx !== -1) {
        sites[existingIdx].blockUntil = blockUntil;
      } else {
        sites.push({ domain, blockUntil });
      }

      setSites(sites, (updated) => {
        sendResponse(updated);
      });
    });
    return true;
  }

  if (message.type === "GET_SITES") {
    getSites((sites) => {
      sendResponse(sites);
    });
    return true;
  }

  if (message.type === "REMOVE_SITE") {
    getSites((sites) => {
      const updated = sites.filter(
        (s) => s.domain !== message.payload
      );
      setSites(updated, (newSites) => {
        sendResponse(newSites);
      });
    });
    return true;
  }
});