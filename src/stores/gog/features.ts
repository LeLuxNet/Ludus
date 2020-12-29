import { Category } from "../../categories";

export const categoryMap: Map<string, Category | null> = new Map([
  ["achievements", Category.GOG_ACHIEVEMENTS],
  ["coop", Category.CO_OP],
  ["cloud_saves", Category.GOG_CLOUD],
  ["controller_support", Category.CONTROLLER_SUPPORT],
  ["leaderboards", Category.GOG_LEADERBOARDS],
  ["multi", Category.MULTI_PLAYER],
  ["overlay", Category.GOG_OVERLAY],
  ["single", Category.SINGLE_PLAYER],
]);
