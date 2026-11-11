document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

document.addEventListener("copy", (event) => {
  event.preventDefault();
});

document.addEventListener("cut", (event) => {
  event.preventDefault();
});

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  const modifierPressed = event.ctrlKey || event.metaKey;

  if (modifierPressed && ["c", "u", "x"].includes(key)) {
    event.preventDefault();
  }
});
