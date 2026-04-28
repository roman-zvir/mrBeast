import { formatWelcome, nextMessage } from './logic.js';
import posthog from 'posthog-js';

// Init PostHog (Using dummy key for local dev, replace with real in prod)
posthog.init(import.meta.env.VITE_POSTHOG_KEY || 'phc_dummy_key_123', {
  api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://eu.posthog.com',
  person_profiles: 'identified_only'
});

const status = document.getElementById('status');
const button = document.getElementById('cta');
const envStatus = document.getElementById('env-status');

if (envStatus) {
  envStatus.textContent = `Environment: ${import.meta.env.VITE_APP_STATUS || 'Unknown'}`;
}

status.textContent = formatWelcome('Guest');

button.addEventListener('click', () => {
  status.textContent = nextMessage(status.textContent);
});

// --- Lab 5: PostHog Task Tracking & Feature Flags ---
posthog.onFeatureFlags(() => {
  if (posthog.isFeatureEnabled('show-urgent-filter')) {
    const urgentBtn = document.getElementById('urgent-btn');
    if (urgentBtn) urgentBtn.style.display = 'inline-block';
  }
});

const addTaskBtn = document.getElementById('add-task-btn');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

if (addTaskBtn) {
  addTaskBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (!text) return;

    posthog.capture('task_created', {
      priority: 'high',
      category: 'work',
      is_authenticated: true
    });

    const li = document.createElement('li');
    li.textContent = text + ' ';

    const btnComplete = document.createElement('button');
    btnComplete.textContent = 'Complete';
    btnComplete.onclick = () => {
      posthog.capture('task_completed', {
        time_to_complete_seconds: Math.floor(Math.random() * 120 + 1)
      });
      li.style.textDecoration = 'line-through';
    };

    const btnDelete = document.createElement('button');
    btnDelete.textContent = 'Delete';
    btnDelete.onclick = () => {
      posthog.capture('task_deleted', { reason: 'mistake' });
      li.remove();
    };

    li.appendChild(btnComplete);
    li.appendChild(btnDelete);
    taskList.appendChild(li);

    taskInput.value = '';
  });
}
