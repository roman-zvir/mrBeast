const status = document.getElementById("status");
const button = document.getElementById("cta");
const { formatWelcome, nextMessage } = window.mrzLogic;

status.textContent = formatWelcome("Guest");

button.addEventListener("click", () => {
  status.textContent = nextMessage(status.textContent);
});
