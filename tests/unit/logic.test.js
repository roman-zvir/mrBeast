import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  addItem,
  applyDiscount,
  buildTaskMetrics,
  calculateTotal,
  completeTask,
  createTask,
  deleteTask,
  filterTasks,
  formatWelcome,
  nextMessage,
  shouldShowCta
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

test('createTask builds normalized task objects', () => {
  const task = createTask(
    {
      title: '  Prepare release notes  ',
      priority: 'high',
      category: 'ops'
    },
    1000
  );

  assert.deepEqual(task, {
    id: 1000,
    title: 'Prepare release notes',
    priority: 'high',
    category: 'ops',
    completed: false,
    createdAt: 1000,
    completedAt: null
  });
});

test('completeTask stores completion timestamp', () => {
  const completed = completeTask(
    {
      id: 1,
      title: 'Instrument Sentry',
      priority: 'medium',
      category: 'ops',
      createdAt: 500,
      completed: false,
      completedAt: null
    },
    1700
  );

  assert.equal(completed.completed, true);
  assert.equal(completed.completedAt, 1700);
});

test('deleteTask removes selected task', () => {
  const tasks = [
    { id: 1, title: 'A' },
    { id: 2, title: 'B' }
  ];

  assert.deepEqual(deleteTask(tasks, 1), [{ id: 2, title: 'B' }]);
});

test('filterTasks supports urgent and completed modes', () => {
  const tasks = [
    { id: 1, priority: 'high', completed: false },
    { id: 2, priority: 'low', completed: true }
  ];

  assert.deepEqual(filterTasks(tasks, 'urgent'), [tasks[0]]);
  assert.deepEqual(filterTasks(tasks, 'completed'), [tasks[1]]);
  assert.deepEqual(filterTasks(tasks, 'all'), tasks);
});

test('buildTaskMetrics summarizes task health', () => {
  const metrics = buildTaskMetrics([
    {
      id: 1,
      priority: 'high',
      completed: true,
      createdAt: 0,
      completedAt: 3000
    },
    {
      id: 2,
      priority: 'low',
      completed: false,
      createdAt: 1000,
      completedAt: null
    }
  ]);

  assert.deepEqual(metrics, {
    total: 2,
    completed: 1,
    open: 1,
    urgent: 1,
    completionRate: 50,
    averageCompletionSeconds: 3
  });
});
