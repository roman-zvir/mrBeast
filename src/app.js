const status = document.getElementById("status");
const button = document.getElementById("cta");

status.textContent = "Hello from the conflict branch.";

button.addEventListener("click", () => {
  status.textContent = "You clicked the MVP button.";
});
