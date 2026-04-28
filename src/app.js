const status = document.getElementById("status");
const button = document.getElementById("cta");

status.textContent = "Welcome to the MrZvir MVP.";

button.addEventListener("click", () => {
  status.textContent = "You clicked the MVP button.";
});
