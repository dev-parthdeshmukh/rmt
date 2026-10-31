// Single source of truth: copy, colours, fonts, timing.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const DEV = "Yatra One"; // Devanagari display
export const UI = "Mukta"; // Devanagari + Latin body
loadFont({ family: DEV, url: staticFile("fonts/YatraOne.ttf"), format: "truetype" });
loadFont({ family: UI, url: staticFile("fonts/Mukta-SemiBold.ttf"), weight: "600", format: "truetype" });
loadFont({ family: UI, url: staticFile("fonts/Mukta-Bold.ttf"), weight: "700", format: "truetype" });
loadFont({ family: UI, url: staticFile("fonts/Mukta-ExtraBold.ttf"), weight: "800", format: "truetype" });

export const FPS = 30;
export const W = 1080;
export const H = 1920;

export const C = {
  navy: "#071233",
  saffron: "#FF9933",
  white: "#FFFFFF",
  green: "#138808",
  chakra: "#1b2a8f",
  gold: "#ffd45c",
  cream: "#fff3d6",
};
export const GOLD = "linear-gradient(180deg, #fff6c9 0%, #ffd45c 45%, #f2992a 100%)";

export const COPY = {
  date: "३१ ऑक्टोबर",
  en: "NATIONAL UNITY DAY",
  hook1: "राष्ट्रीय",
  hook2: "एकता दिवस",
  patelLabel: "लोहपुरुष",
  patelName: "सरदार वल्लभभाई पटेल",
  patelTribute: "यांना विनम्र अभिवादन",
  map1: "एक भारत,",
  map2: "श्रेष्ठ भारत",
  run: "एकत्र शिकूया,",
  hands: "एकत्र घडूया!",
  handsSub: "Rapid Mind’s Tutorials सोबत",
  greet1: "राष्ट्रीय एकता दिवसाच्या",
  greet2: "हार्दिक शुभेच्छा!",
  brand: "Rapid Mind’s Tutorials",
  place: "Line Ali, Old Panvel",
};

// Global timeline in frames [start, end). Neighbouring scenes overlap during transitions.
export const T = {
  hook: [0, 100],
  statue: [84, 256],
  map: [240, 334],
  run: [318, 390],
  hands: [378, 468],
  flag: [452, 516],
  end: [500, 630],
  total: 630,
  // tricolour ribbon wipes: [start, end]; the cut sits in the middle
  wipe1: [80, 104],
  wipe2: [236, 260],
  wipe3: [314, 338],
  push: [378, 392], // run -> hands slide-push
  flash: [448, 460], // hands -> flag light flash
  wipe4: [496, 520],
} as const;
