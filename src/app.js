import { formatWelcome, nextMessage } from './logic.js';

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
