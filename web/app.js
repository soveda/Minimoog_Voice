const root = document.documentElement;
const savedTheme = localStorage.getItem("minimoog-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("minimoog-theme", theme);
  document.querySelectorAll("[data-theme]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.theme === theme);
  });
}

document.querySelectorAll("[data-theme]").forEach((button) => {
  button.addEventListener("click", () => setTheme(button.dataset.theme));
});

document.querySelectorAll('input[type="range"]').forEach((input) => {
  const readout = document.createElement("output");
  readout.className = "range-readout";
  input.insertAdjacentElement("afterend", readout);

  const updateReadout = () => {
    readout.value = `${input.value}${input.dataset.unit ? ` ${input.dataset.unit}` : ""}`;
  };

  input.addEventListener("input", updateReadout);
  updateReadout();
});

setTheme(savedTheme || preferredTheme);
