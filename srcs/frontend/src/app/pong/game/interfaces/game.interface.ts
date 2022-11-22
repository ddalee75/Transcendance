import { LevelAi } from '../ai';
import { IBallConfig } from './ball-config.interface';
import { IBoard } from './board.interface';
import { IGameStates } from './game-states.interface';
import { IPlayer } from './player.interface';

export type GameMode =
  | {
      type: 'local';
    }
  | {
      type: 'server';
    };
export type PlayerMode =
  | {
      type: 'local';
      upKey: string;
      downKey: string;
    }
  | {
      type: 'ai';
      level: LevelAi;
    }
  | {
      type: 'remote';
      id: number;
    };

export interface IGame {
  left: IPlayer,
  right: IPlayer,
  board: IBoard,
  ball: IBallConfig;
  states: IGameStates;
}
