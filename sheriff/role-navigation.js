const adminLinks = document.querySelectorAll('[data-required-role="STAFF"]');
const discordButtons = document.querySelectorAll("[data-discord-connect]");
const discordLabels = document.querySelectorAll("[data-discord-label]");
const discordFeedback = document.querySelector("[data-discord-feedback]");
const signOutButtons = document.querySelectorAll("[data-sign-out]");
let isAuthenticated = false;

function updateRoleNavigation(event) {
  const user = event.detail?.isAuthenticated ? event.detail.user : null;
  isAuthenticated = Boolean(user);
  const isStaff = user?.grade?.trim().toLocaleUpperCase("ro") === "STAFF";
  const discordStatus = isAuthenticated ? "Conectat" : "Neconectat";

  adminLinks.forEach((link) => {
    link.hidden = !isStaff;
  });
  discordButtons.forEach((button) => {
    button.setAttribute("aria-label", `Discord: ${discordStatus}`);
    button.title = discordStatus;
  });
  discordLabels.forEach((label) => {
    label.textContent = discordStatus;
  });
  signOutButtons.forEach((button) => {
    button.hidden = !isAuthenticated;
  });
}

adminLinks.forEach((link) => {
  link.hidden = true;
});

document.addEventListener("sheriff:auth-state", updateRoleNavigation);

discordButtons.forEach((button) => {
  button.addEventListener("click", () => {
    discordFeedback.textContent = isAuthenticated
      ? "Ești deja conectat."
      : "Autentificarea cu Discord nu este configurată încă.";
    discordFeedback.hidden = false;
  });
});
