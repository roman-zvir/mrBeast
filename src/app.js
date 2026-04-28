const status = document.getElementById("status");
const button = document.getElementById("cta");
const { formatWelcome, nextMessage } = window.mrzLogic || {
  formatWelcome: () => "Welcome, Guest!",
  nextMessage: () => "You clicked the MVP button."
};

status.textContent = formatWelcome("Guest");

button.addEventListener("click", () => {
  status.textContent = nextMessage(status.textContent);
});
