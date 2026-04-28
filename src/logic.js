const bugMode =
  typeof process !== 'undefined' && process.env && process.env.BUG_MODE === '1';

export function formatWelcome(name) {
  const safeName = String(name || 'Guest').trim();
  return `Welcome, ${safeName}!`;
}

export function addItem(items, item) {
  return [...items, item];
}

export function calculateTotal(items) {
  const sum = items.reduce((total, item) => total + item.price, 0);
  if (bugMode) {
    return sum - 1;
  }
  return sum;
}

export function applyDiscount(total, percent) {
  if (percent <= 0) {
    return total;
  }
  return Number((total * (1 - percent / 100)).toFixed(2));
}

export function shouldShowCta({ loggedIn, itemsCount }) {
  return Boolean(loggedIn) && itemsCount > 0;
}

export async function getGreeting(fetchProfile, userId) {
  const profile = await fetchProfile(userId);
  return formatWelcome(profile.name);
}

export function nextMessage(previous) {
  if (previous.includes('clicked')) {
    return 'Thanks for exploring the MVP.';
  }
  return 'You clicked the MVP button.';
}
