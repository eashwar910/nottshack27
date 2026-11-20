// Site-wide settings. Edit this file, not the HTML, for the things that change.

// LOGO is used by the nav bar and the bouncing easter egg (every <img data-logo>).
const LOGO = "assets/NottsHack-logo/nottshack-dark.png";
document.querySelectorAll("[data-logo]").forEach(i => i.src = LOGO);

// Where every "Register" button goes. Leave "" until registration is open (they scroll to the join section).
const REGISTER_URL = "";

// 2027 sponsors, by tier. While a tier is empty it shows its own artwork and a "Be a ... sponsor" button.
// Add a sponsor and its logo replaces the artwork, with that tier's animation:
//   { name: "Acme", logo: "assets/sponsors/acme.svg", url: "https://acme.com" }
// Put logo files in assets/sponsors/. Use a white or light logo on a transparent background (tiles are dark);
// if your logo is dark, add  light: true  and the tile turns light instead.
// `logo`, `url` and `light` are optional: without a logo the name is shown as text.
const SPONSORS = {
  founding: [],
  diamond: [],
  platinum: [],
  gold: [],
  community: []
};

// The three tracks, in order. Until a track has a sponsor it shows as "to be announced".
// When confirmed, fill it in; the card switches over by itself:
//   { sponsor: { name: "Acme", logo: "assets/sponsors/acme.svg" }, title: "Build the future of X", brief: "One or two sentences." }
const TRACKS = [
  {},
  {},
  {}
];
