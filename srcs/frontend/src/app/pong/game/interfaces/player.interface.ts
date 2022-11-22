import { PlayerMode } from "./game.interface";
import { IInput } from "./input.interface";
import { IRacketConfig } from "./racket-config.interface";

export interface IPlayer {
  id: number;
  mode: PlayerMode;
  racket: IRacketConfig;
  input: IInput;
}
