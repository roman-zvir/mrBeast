import * as Sentry from '@sentry/browser';
import posthog from 'posthog-js';
import {
  DEFAULT_TASKS,
  buildTaskMetrics,
  completeTask,
  createTask,
  deleteTask,
  filterTasks,
  formatWelcome,
  nextMessage
} from './logic.js';

const env = import.meta.env;

const status = document.getElementById('status');
const button = document.getElementById('cta');
const envStatus = document.getElementById('env-status');
const simulateErrorButton = document.getElementById('simulate-error');
const urgentButton = document.getElementById('urgent-btn');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskPriority = document.getElementById('task-priority');
const taskCategory = document.getElementById('task-category');
const taskList = document.getElementById('task-list');
const metricsGrid = document.getElementById('metrics-grid');
const observabilityStatus = document.getElementById('observability-status');

const sentryDsn = env.VITE_SENTRY_DSN || '';
const release = env.VITE_RELEASE || `mrzvir@${env.MODE}`;
const hasRealPosthogKey =
  Boolean(env.VITE_POSTHOG_KEY) && env.VITE_POSTHOG_KEY !== 'phc_dummy_key_123';
const serviceStatus = {
  posthog: hasRealPosthogKey,
  sentry: Boolean(sentryDsn)
};

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: env.MODE,
    release,
    integrations: [],
    tracesSampleRate: Number(env.VITE_SENTRY_TRACES_SAMPLE_RATE || 1),
    initialScope: {
      tags: {
        app: 'mrzvir',
        lab: 'lab6'
      },
      user: {
        id: 'guest-user',
        segment: 'student'
      }
    }
  });

  Sentry.setTag('environment', env.MODE);
  Sentry.setContext('app', {
    release,
    appStatus: env.VITE_APP_STATUS || 'Unknown'
  });
}

posthog.init(env.VITE_POSTHOG_KEY || 'phc_dummy_key_123', {
  api_host: env.VITE_POSTHOG_HOST || 'https://eu.posthog.com',
  person_profiles: 'identified_only',
  capture_pageview: true,
  capture_pageleave: true,
  autocapture: true,
  loaded: (instance) => {
    instance.identify('guest-user', {
      role: 'student',
      environment: env.MODE,
      release
    });

    instance.setPersonPropertiesForFlags({
      role: 'student',
      environment: env.MODE,
      release
    });

    instance.register({
      environment: env.MODE,
      release
    });
  }
});

let tasks = DEFAULT_TASKS.map((task, index) => ({
  ...task,
  id: index + 1,
  createdAt: Date.now() - (index + 1) * 60000
}));
let activeFilter = 'all';

if (envStatus) {
  envStatus.textContent = env.VITE_APP_STATUS || 'Unknown';
}

status.textContent = formatWelcome('Guest');
observabilityStatus.textContent = buildObservabilityMessage();
render();

button.addEventListener('click', () => {
  status.textContent = nextMessage(status.textContent);
  posthog.capture('button_clicked', {
    location: 'hero',
    current_message: status.textContent
  });

  addClientBreadcrumb('info', 'Primary CTA clicked');
});

simulateErrorButton.addEventListener('click', () => {
  const error = new Error(
    'Simulated client-side failure from delivery console'
  );

  if (sentryDsn) {
    addClientBreadcrumb('error', 'Simulated client error triggered');
    Sentry.captureException(error, {
      tags: {
        source: 'simulate-error'
      },
      extra: {
        activeFilter,
        taskCount: tasks.length
      }
    });
  }

  observabilityStatus.textContent =
    'Simulated error sent. Check your Sentry issues dashboard.';
  posthog.capture('error_simulated', {
    source: 'ui_button',
    has_sentry: Boolean(sentryDsn)
  });
});

posthog.onFeatureFlags(() => {
  const showUrgentFilter = posthog.isFeatureEnabled('show-urgent-filter');
  urgentButton.hidden = !showUrgentFilter;

  if (showUrgentFilter) {
    observabilityStatus.textContent =
      'Feature flag active: urgent filter is available for targeted workflows.';
  } else {
    observabilityStatus.textContent = buildObservabilityMessage();
  }
});

urgentButton.addEventListener('click', () => {
  activeFilter = activeFilter === 'urgent' ? 'all' : 'urgent';
  urgentButton.textContent =
    activeFilter === 'urgent' ? 'Show all tasks' : 'Only urgent';

  posthog.capture('urgent_filter_toggled', {
    filter_state: activeFilter
  });

  addClientBreadcrumb('info', `Urgent filter changed to ${activeFilter}`);

  render();
});

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = taskInput.value.trim();
  if (!title) {
    return;
  }

  const task = createTask({
    title,
    priority: taskPriority.value,
    category: taskCategory.value
  });

  tasks = [...tasks, task];
  taskForm.reset();
  taskPriority.value = 'medium';
  taskCategory.value = 'analytics';

  posthog.capture('task_created', {
    priority: task.priority,
    category: task.category,
    is_authenticated: false,
    total_tasks_after_create: tasks.length
  });

  addClientBreadcrumb('info', `Task created: ${task.title}`);

  render();
});

taskList.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const taskId = Number(target.dataset.taskId);
  if (!taskId) {
    return;
  }

  if (target.dataset.action === 'complete') {
    const task = tasks.find((item) => item.id === taskId);
    if (!task || task.completed) {
      return;
    }

    const completedTask = completeTask(task);
    tasks = tasks.map((item) => (item.id === taskId ? completedTask : item));

    posthog.capture('task_completed', {
      category: completedTask.category,
      priority: completedTask.priority,
      time_to_complete_seconds: Math.max(
        1,
        Math.round((completedTask.completedAt - completedTask.createdAt) / 1000)
      )
    });

    addClientBreadcrumb('info', `Task completed: ${completedTask.title}`);

    render();
    return;
  }

  if (target.dataset.action === 'delete') {
    const deletedTask = tasks.find((item) => item.id === taskId);
    tasks = deleteTask(tasks, taskId);

    posthog.capture('task_deleted', {
      reason: deletedTask?.completed ? 'cleanup' : 'mistake',
      priority: deletedTask?.priority || 'unknown'
    });

    addClientBreadcrumb(
      'warning',
      `Task deleted: ${deletedTask?.title || 'unknown task'}`
    );

    render();
  }
});

function render() {
  renderTasks();
  renderMetrics();
}

function renderTasks() {
  const visibleTasks = filterTasks(tasks, activeFilter);

  taskList.innerHTML = visibleTasks
    .map(
      (task) => `
        <li class="task-item${task.completed ? ' completed' : ''}">
          <div class="task-main">
            <span class="task-title">${escapeHtml(task.title)}</span>
            <div class="task-meta">
              <span class="badge priority-${task.priority}">${task.priority}</span>
              <span class="badge">${task.category}</span>
            </div>
          </div>
          <div class="task-actions">
            <button type="button" data-action="complete" data-task-id="${task.id}">
              Complete
            </button>
            <button type="button" data-action="delete" data-task-id="${task.id}">
              Delete
            </button>
          </div>
        </li>
      `
    )
    .join('');

  if (!visibleTasks.length) {
    taskList.innerHTML =
      '<li class="task-item"><div class="task-main"><span class="task-title">No tasks match the current filter.</span></div></li>';
  }
}

function renderMetrics() {
  const metrics = buildTaskMetrics(tasks);
  const cards = [
    {
      label: 'Total tasks',
      value: metrics.total,
      hint: 'Tracked product actions'
    },
    {
      label: 'Completion rate',
      value: `${metrics.completionRate}%`,
      hint: 'Useful for funnel-style progress'
    },
    {
      label: 'Urgent tasks',
      value: metrics.urgent,
      hint: 'High-priority backlog size'
    },
    {
      label: 'Avg complete time',
      value: `${metrics.averageCompletionSeconds}s`,
      hint: 'Operational latency proxy'
    },
    {
      label: 'Analytics',
      value: serviceStatus.posthog ? 'Live' : 'Stub',
      hint: 'PostHog capture configuration'
    },
    {
      label: 'Error tracking',
      value: serviceStatus.sentry ? 'Live' : 'Stub',
      hint: 'Sentry DSN availability'
    }
  ];

  metricsGrid.innerHTML = cards
    .map(
      (card) => `
        <article class="metric-card">
          <p class="panel-kicker">${card.label}</p>
          <strong>${card.value}</strong>
          <span>${card.hint}</span>
        </article>
      `
    )
    .join('');
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function addClientBreadcrumb(level, message) {
  if (!serviceStatus.sentry) {
    return;
  }

  Sentry.addBreadcrumb({
    category: 'ui.action',
    message,
    level,
    data: {
      activeFilter,
      taskCount: tasks.length
    }
  });
}

function buildObservabilityMessage() {
  const analyticsState = serviceStatus.posthog
    ? 'PostHog live'
    : 'PostHog stub mode';
  const sentryState = serviceStatus.sentry
    ? 'Sentry live'
    : 'Sentry DSN missing';

  return `${analyticsState}. ${sentryState}. Source maps enabled for production debugging.`;
}
