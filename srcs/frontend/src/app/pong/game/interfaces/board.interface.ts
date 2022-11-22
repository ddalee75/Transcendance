import { IBoardConfig } from './board-config.interface';
import { GameMode } from './game.interface';

export interface IBoard {
  id: number;
  mode: GameMode;
  board: IBoardConfig;
  scoreToWin: number;
}
