import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { getGreeting } from '../../src/logic.js';

test('getGreeting uses mocked profile', async () => {
  const fetchProfile = mock.fn(async () => ({ name: 'Oleh' }));
  const greeting = await getGreeting(fetchProfile, 7);

  assert.equal(greeting, 'Welcome, Oleh!');
  assert.equal(fetchProfile.mock.calls.length, 1);
  assert.deepEqual(fetchProfile.mock.calls[0].arguments, [7]);
});
