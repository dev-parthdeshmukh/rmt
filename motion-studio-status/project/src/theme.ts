// Single source of truth for copy, colours, fonts and timing.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled locally (public/fonts) so rendering never depends on a network fetch.
export const display = "Unbounded";
export const body = "Plus Jakarta Sans";
loadFont({ family: display, url: staticFile("fonts/Unbounded.ttf"), weight: "200 900", format: "truetype" });
loadFont({ family: body, url: staticFile("fonts/PlusJakartaSans.ttf"), weight: "200 800", format: "truetype" });
loadFont({ family: body, url: staticFile("fonts/PlusJakartaSans-Italic.ttf"), weight: "200 800", style: "italic", format: "truetype" });

export const FPS = 30;
export const W = 1080;
export const H = 1920;

export const C = {
  bg: "#0b0a24",
  bg2: "#1a1050",
  surface: "rgba(255,255,255,0.07)",
  stroke: "rgba(255,255,255,0.16)",
  text: "#ffffff",
  muted: "#b9b6d9",
  gold: "#ffc94a",
  gold2: "#ff9d2e",
  blue: "#4eaddd",
  teal: "#3faaa2",
  green: "#9fcb58",
  sand: "#dcb572",
  coral: "#dd4f3b",
  magenta: "#d63384",
  plum: "#9d2265",
};
export const SPECTRUM = `linear-gradient(90deg, ${C.blue}, ${C.teal}, ${C.green}, ${C.sand}, ${C.coral}, ${C.plum})`;
export const GOLD = `linear-gradient(180deg, #fff1b8 0%, ${C.gold} 45%, ${C.gold2} 100%)`;

export const COPY = {
  hook1: "UNLOCK YOUR",
  hook2: "POTENTIAL",
  adm1: "ADMISSIONS",
  adm2: "OPEN",
  admSub: "Rapid Mind’s Tutorials · Old Panvel",
  cbse: { tag: "BOARD", title: "CBSE", from: 5, to: 10 },
  state: { tag: "BOARD", title1: "STATE", title2: "BOARD", from: 5, to: 12 },
  commerce: "COMMERCE",
  commerceSub: "for 11th & 12th",
  visit: "VISIT US",
  place: "Old Panvel",
  address: ["First Floor, Lagad Pride,", "Line Ali, Old Panvel,", "Maharashtra 410206"],
  brand1: "RAPID MIND’S",
  brand2: "TUTORIALS",
  cta: "ENROLL NOW",
  tagline: "“Empower Your Mind, Education is the Key!”",
};

// Global timeline (frames). Scenes overlap during transitions.
export const T = {
  s1: [0, 78],
  s2: [62, 152],
  s3: [140, 250],
  s4: [238, 362],
  s5: [350, 448],
  s6: [436, 510],
  total: 510,
  // transition windows
  iris: [60, 80],
  flood1: [138, 158],
  flood2: [236, 256],
  whip: [348, 362],
  zoom: [434, 452],
} as const;
