const websiteCategories = {
  productive: [
    "github.com",
    "stackoverflow.com",
    "leetcode.com",
    "codepen.io",
    "chat.openai.com"
  ],
  unproductive: [
    "youtube.com",
    "instagram.com",
    "facebook.com",
    "twitter.com"
  ]
};

// Helper: normalize domain
function normalizeDomain(url) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return null;
  }
}

// Helper: detect category
function getCategory(domain) {
  if (!domain) return "neutral";

  if (websiteCategories.productive.some(site => domain.includes(site))) {
    return "productive";
  }

  if (websiteCategories.unproductive.some(site => domain.includes(site))) {
    return "unproductive";
  }

  return "neutral";
}

let activeTabId = null;
let activeStartTime = null;
let activeUrl = null;

// When tab changes
chrome.tabs.onActivated.addListener(({ tabId }) => {
  handleTabChange(tabId);
});

// When tab URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.status === "complete") {
    handleTabChange(tabId);
  }
});

// When window focus changes (important!)
chrome.windows.onFocusChanged.addListener(() => {
  saveActiveTime();
  activeTabId = null;
  activeStartTime = null;
  activeUrl = null;
});

async function handleTabChange(tabId) {
  saveActiveTime();

  const tab = await chrome.tabs.get(tabId);
  if (!tab || !tab.url) return;

  activeTabId = tabId;
  activeStartTime = Date.now();
  activeUrl = tab.url;
}

function saveActiveTime() {
  if (!activeUrl || !activeStartTime) return;

  const timeSpent = Date.now() - activeStartTime;
  saveTime(activeUrl, timeSpent);
}

function saveTime(url, timeSpent) {
  const domain = normalizeDomain(url);
  const category = getCategory(domain);

  chrome.storage.local.get(
    ["timeData", "categoryData"],
    (result) => {
      const timeData = result.timeData || {};
      const categoryData = result.categoryData || {
        productive: 0,
        unproductive: 0,
        neutral: 0
      };

      timeData[domain] = (timeData[domain] || 0) + timeSpent;
      categoryData[category] += timeSpent;

      chrome.storage.local.set({ timeData, categoryData });
    }
  );
}
