import { Category } from "../../categories";

export const categoryMap: Map<string, Category | null> = new Map([
  ["1080", null], // Survival
  ["1083", null], // Rogue-lite
  ["1084", null], // Stealth
  ["1088", null], // Turn-based strategy
  ["1090", null], // Tactical
  ["1102", null], // Programming
  ["1110", null], // Party
  ["1141", null], // Free2play
  ["1115", null], // Strategy
  ["1116", null], // Comedy
  ["1117", null], // Adventure
  ["1127", null], // Investigation
  ["1132", null], // Sci-Fi
  ["1151", null], // Metroidvania
  ["1159", null], // Arcade
  ["1166", null], // 4X
  ["1179", Category.VR],
  ["1181", null], // Card game
  ["1185", null], // FPS
  ["1203", Category.MULTI_PLAYER],
  ["1210", null], // Shooter
  ["1212", null], // Racing
  ["1216", null], // Action
  ["1218", null], // Horror
  ["1233", null], // Base building
  ["1247", null], // Metroidvania
  ["1258", null], // Rogue-like
  ["1259", null], // Storybook
  ["1263", null], // Indie
  ["1264", Category.CO_OP],
  ["1265", null], // Dungeon crawler
  ["1279", null], // Vampire
  ["1283", null], // Sports
  ["1287", null], // Fantasy
  ["1294", null], // First-person
  ["1296", null], // Casual
  ["1298", null], // Puzzle
  ["1299", null], // Competitive
  ["1307", null], // Open world
  ["1310", Category.EARLY_ACCESS],
  ["1318", null], // Trivia
  ["1333", null], // Action-RPG
  ["1336", null], // Action-Adventure
  ["1344", null], // Fighting
  ["1349", null], // Fast paced
  ["1367", null], // RPG
  ["1370", Category.SINGLE_PLAYER],
  ["1381", null], // Exploration
  ["1386", null], // Turn-based
  ["1393", null], // Simulation
  ["1395", Category.COMMENTARY],
  ["1400", null], // Physics
  ["9547", null], // Windows
  ["9548", null], // OSX
  ["9549", Category.CONTROLLER_SUPPORT],
  ["9559", Category.LEVEL_EDITOR], // ?
  ["10719", null], // MacOS
  ["11631", null], // Required 2FA
  ["14346", null], // Holiday Sale 2020
]);
