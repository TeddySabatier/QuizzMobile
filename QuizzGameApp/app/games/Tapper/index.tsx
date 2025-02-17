import { TapperGame, useTapperGame } from "./game";
import { SettingsDialog, useGameSettings } from "./gameSettings";
import config from "./config.json";

const useGame = useTapperGame;
const Game = TapperGame;
export { Game, useGame, SettingsDialog, useGameSettings, config };