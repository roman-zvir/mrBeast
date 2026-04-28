import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatWelcome,
  addItem,
  calculateTotal,
  applyDiscount,
  shouldShowCta,
  nextMessage
} from '../../src/logic.js';

test('formatWelcome uses name', () => {
  assert.equal(formatWelcome('Marta'), 'Welcome, Marta!');
});

test('addItem returns new array', () => {
  const items = [{ id: 1 }];
  const next = addItem(items, { id: 2 });
  assert.equal(next.length, 2);
  assert.notEqual(next, items);
});

test('calculateTotal sums item prices', () => {
  const items = [{ price: 10 }, { price: 4.5 }];
  assert.equal(calculateTotal(items), 14.5);
});

test('applyDiscount reduces total', () => {
  assert.equal(applyDiscount(100, 15), 85);
});

test('shouldShowCta requires login and items', () => {
  assert.equal(shouldShowCta({ loggedIn: true, itemsCount: 1 }), true);
  assert.equal(shouldShowCta({ loggedIn: false, itemsCount: 1 }), false);
});

test('nextMessage toggles text', () => {
  assert.equal(nextMessage('Welcome'), 'You clicked the MVP button.');
  assert.equal(
    nextMessage('You clicked the MVP button.'),
    'Thanks for exploring the MVP.'
  );
});
