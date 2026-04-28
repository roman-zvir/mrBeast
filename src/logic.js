const bugMode =
  typeof process !== "undefined" &&
  process.env &&
  process.env.BUG_MODE === "1";

function formatWelcome(name) {
  const safeName = String(name || "Guest").trim();
  return `Welcome, ${safeName}!`;
}

function addItem(items, item) {
  return [...items, item];
}

function calculateTotal(items) {
  const sum = items.reduce((total, item) => total + item.price, 0);
  if (bugMode) {
    return sum - 1;
  }
  return sum;
}

function applyDiscount(total, percent) {
  if (percent <= 0) {
    return total;
  }
  return Number((total * (1 - percent / 100)).toFixed(2));
}

function shouldShowCta({ loggedIn, itemsCount }) {
  return Boolean(loggedIn) && itemsCount > 0;
}

async function getGreeting(fetchProfile, userId) {
  const profile = await fetchProfile(userId);
  return formatWelcome(profile.name);
}

function nextMessage(previous) {
  if (previous.includes("clicked")) {
    return "Thanks for exploring the MVP.";
  }
  return "You clicked the MVP button.";
}

const api = {
  formatWelcome,
  addItem,
  calculateTotal,
  applyDiscount,
  shouldShowCta,
  getGreeting,
  nextMessage
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = api;
}

if (typeof window !== "undefined") {
  window.mrzLogic = api;
}
