// Site-wide settings.
// LOGO is used by the nav bar and the bouncing easter egg (every <img data-logo>).
// The "Meet NottsHack" section uses assets/logo-shadow.png directly in index.html.
const LOGO = "assets/NottsHack-logo/nottshack-dark.png";
document.querySelectorAll("[data-logo]").forEach(i => i.src = LOGO);
