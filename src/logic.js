const bugMode =
  typeof process !== 'undefined' && process.env && process.env.BUG_MODE === '1';

export const DEFAULT_TASKS = [
  {
    id: 1,
    title: 'Set up analytics instrumentation',
    priority: 'high',
    category: 'analytics',
    completed: false,
    createdAt: 0,
    completedAt: null
  },
  {
    id: 2,
    title: 'Prepare CI quality gates',
    priority: 'medium',
    category: 'delivery',
    completed: false,
    createdAt: 0,
    completedAt: null
  }
];

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

export function createTask(task, now = Date.now()) {
  return {
    id: now,
    title: String(task.title || '').trim(),
    priority: task.priority || 'medium',
    category: task.category || 'general',
    completed: false,
    createdAt: now,
    completedAt: null
  };
}

export function completeTask(task, completedAt = Date.now()) {
  return {
    ...task,
    completed: true,
    completedAt
  };
}

export function deleteTask(tasks, taskId) {
  return tasks.filter((task) => task.id !== taskId);
}

export function filterTasks(tasks, filter = 'all') {
  if (filter === 'urgent') {
    return tasks.filter((task) => task.priority === 'high');
  }

  if (filter === 'completed') {
    return tasks.filter((task) => task.completed);
  }

  return tasks;
}

export function buildTaskMetrics(tasks) {
  const completed = tasks.filter((task) => task.completed);
  const urgent = tasks.filter((task) => task.priority === 'high');
  const averageCompletionSeconds = completed.length
    ? Math.round(
        completed.reduce((sum, task) => {
          if (!task.completedAt) {
            return sum;
          }

          return sum + Math.max(1, (task.completedAt - task.createdAt) / 1000);
        }, 0) / completed.length
      )
    : 0;

  return {
    total: tasks.length,
    completed: completed.length,
    open: tasks.length - completed.length,
    urgent: urgent.length,
    completionRate: tasks.length
      ? Number(((completed.length / tasks.length) * 100).toFixed(1))
      : 0,
    averageCompletionSeconds
  };
}
