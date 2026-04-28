const { test, mock } = require('node:test');
const assert = require('node:assert/strict');
const { getGreeting } = require('../../src/logic');

test('getGreeting uses mocked profile', async () => {
  const fetchProfile = mock.fn(async () => ({ name: 'Oleh' }));
  const greeting = await getGreeting(fetchProfile, 7);

  assert.equal(greeting, 'Welcome, Oleh!');
  assert.equal(fetchProfile.mock.calls.length, 1);
  assert.deepEqual(fetchProfile.mock.calls[0].arguments, [7]);
});
