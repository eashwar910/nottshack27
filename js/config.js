// Site-wide settings. Edit this file, not the HTML, for the things that change.

// LOGO is used by the nav bar and the bouncing easter egg (every <img data-logo>).
const LOGO = "assets/NottsHack-logo/nottshack-dark.png";
document.querySelectorAll("[data-logo]").forEach(i => i.src = LOGO);

// Where every "Register" button goes. Leave "" until registration is open (they scroll to the join section).
const REGISTER_URL = "";

// 2027 sponsors. While every list is empty the sponsor wall stays hidden and the section reads "Partner with NottsHack".
// Add a sponsor and the wall appears automatically:
//   { name: "Acme", logo: "assets/sponsors/acme.svg", url: "https://acme.com" }
// Put logo files in assets/sponsors/ (SVG or transparent PNG, ideally on a light background; they sit on a light tile).
// `logo` and `url` are optional: without a logo the name is shown as text.
const SPONSORS = {
  founding: [],
  diamond: [],
  platinum: []
};
