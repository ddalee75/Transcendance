import { Component, OnDestroy, OnInit } from "@angular/core";
import { filter, fromEvent, interval, Subscription } from "rxjs";
import { SocketService } from "../services/socket.service";
import { Ai } from "./game/ai";
import { defaultGameConfig } from "./game/config";
import { Game } from "./game/game";
import { IGameStates } from "./game/interfaces/game-states.interface";
import { IGame, PlayerMode } from "./game/interfaces/game.interface";
import { IInput } from "./game/interfaces/input.interface";

const interval_tick = 8;
const keyStart = " ";

@Component({
  selector: "app-pong",
  templateUrl: "./pong.component.html",
  styleUrls: ["./pong.component.css"],
  providers: [Game, Ai],
})
export class PongComponent implements OnInit, OnDestroy {
  gameConfig: IGame;
  moveLeft: IInput;
  moveRight: IInput;
  prevMoveLeft: IInput;
  prevMoveRight: IInput;
  game_title = "FT PONG";

  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;

  moveSubscription!: Subscription;
  startSubscription!: Subscription;
  gameStatesSubscription!: Subscription;
  tickSubscription!: Subscription;
  upSubscription!: Subscription;
  downSubscription!: Subscription;

  constructor(
    private socketService: SocketService,
    private game: Game,
    private ai: Ai
  ) {
    this.gameConfig = structuredClone(defaultGameConfig);
    this.game = new Game();
    this.ai = new Ai();
    this.game.updateAll(this.gameConfig);
    this.ai.setAll(this.gameConfig);
    this.moveLeft = { userId: 0, up: false, down: false };
    this.moveRight = { userId: 1, up: false, down: false };
    this.prevMoveLeft = { userId: 0, up: false, down: false };
    this.prevMoveRight = { userId: 1, up: false, down: false };
  }

  ngOnInit(): void {
    this.moveSubscription = this.socketService
      .getMove()
      .subscribe((move: IInput) => {
        this.game.updateInput(move);
      });
    this.startSubscription = this.socketService.getStart().subscribe(() => {
      this.game.start();
    });
    this.gameStatesSubscription = this.socketService
      .getGameStates()
      .subscribe((states: IGameStates) => {
        this.game.updateStates(states);
      });
    this.tickSubscription = interval(interval_tick).subscribe(() => {
      this.tick();
    });
    this.upSubscription = fromEvent<KeyboardEvent>(document, "keyup")
      .pipe(filter((event) => !event.repeat))
      .subscribe((event) => {
        this.toUp(event.key);
      });
    this.downSubscription = fromEvent<KeyboardEvent>(document, "keydown")
      .pipe(filter((event) => !event.repeat))
      .subscribe((event) => {
        this.toDown(event.key);
      });
    this.canvas = <HTMLCanvasElement>document.getElementById("stage");
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
  }

  ngOnDestroy(): void {
    this.moveSubscription.unsubscribe();
    this.startSubscription.unsubscribe();
    this.gameStatesSubscription.unsubscribe();
    this.tickSubscription.unsubscribe();
    this.upSubscription.unsubscribe();
    this.downSubscription.unsubscribe();
  }

  sendMove(move: IInput) {
    if (
      move.userId === this.gameConfig.left.id &&
      (move.down !== this.prevMoveLeft.down || move.up !== this.prevMoveLeft.up)
    ) {
      this.socketService.sendMove(move);
      this.prevMoveLeft.up = move.up;
      this.prevMoveLeft.down = move.down;
    } else if (
      move.userId === this.gameConfig.right.id &&
      (move.down !== this.prevMoveRight.down ||
        move.up !== this.prevMoveRight.up)
    ) {
      this.socketService.sendMove(move);
      this.prevMoveRight.up = move.up;
      this.prevMoveRight.down = move.down;
    }
  }

  sendStart() {
    this.socketService.sendStart();
  }

  sendGameStates(gameStates: IGameStates) {
    this.socketService.sendGameStates(gameStates);
  }

  toUp(key: string) {
    if (this.gameConfig.left.mode.type === "local") {
      if (key === this.gameConfig.left.mode.upKey) {
        this.moveLeft.up = false;
      } else if (key === this.gameConfig.left.mode.downKey) {
        this.moveLeft.down = false;
      }
    }
    if (this.gameConfig.right.mode.type === "local") {
      if (key === this.gameConfig.right.mode.upKey) {
        this.moveRight.up = false;
      } else if (key === this.gameConfig.right.mode.downKey) {
        this.moveRight.down = false;
      }
    }
  }

  toDown(key: string) {
    if (this.gameConfig.left.mode.type === "local") {
      if (key === this.gameConfig.left.mode.upKey) {
        this.moveLeft.up = true;
      } else if (key === this.gameConfig.left.mode.downKey) {
        this.moveLeft.down = true;
      }
    }
    if (this.gameConfig.right.mode.type === "local") {
      if (key === this.gameConfig.right.mode.upKey) {
        this.moveRight.up = true;
      } else if (key === this.gameConfig.right.mode.downKey) {
        this.moveRight.down = true;
      }
    }
    if (key === keyStart) {
      this.sendStart();
    }
  }

  tick(): void {
    this.gameConfig.states.racketRight.left =
      this.gameConfig.board.board.width -
      this.gameConfig.board.board.margin -
      this.gameConfig.right.racket.width;

    if (this.gameConfig.left.mode.type !== "remote") {
      const move = this.getInput(
        this.gameConfig.left.mode,
        this.gameConfig.left.id,
        this.moveLeft,
        this.moveLeft
      );
      this.game.updateInput(move);
      this.sendMove(move);
    }
    if (this.gameConfig.right.mode.type !== "remote") {
      const move = this.getInput(
        this.gameConfig.right.mode,
        this.gameConfig.right.id,
        this.moveRight,
        this.moveRight
      );
      this.game.updateInput(move);
      this.sendMove(move);
    }
    this.game.tick();
    if (this.gameConfig.board.mode.type === "server") {
      //this.gameConfig.states = this.game.getGameStates();
    } else {
      this.sendGameStates(this.gameConfig.states);
    }
    this.draw();
    if (!this.gameConfig.states.start || this.game.getWinner != null) {
      this.darken();
    }
  }

  getInput(
    racketMode: PlayerMode,
    userId: number,
    localMove: IInput,
    remoteMove: IInput
  ): IInput {
    if (racketMode.type === "local") {
      return localMove;
    } else if (racketMode.type === "ai") {
      this.ai.setStates(this.gameConfig.states);
      this.ai.setLevel(racketMode.level);
      this.ai.setUserId(userId);
      return this.ai.getInput();
    } else if (racketMode.type === "remote") {
      return remoteMove;
    } else {
      return {
        userId: userId,
        up: false,
        down: false,
      };
    }
  }

  win() {
    return this.game.getWinner();
  }

  reset(): void {
    this.game.updateStates(structuredClone(defaultGameConfig).states);
  }

  resetAll(): void {
    this.game.updateAll(structuredClone(defaultGameConfig));
  }

  roundRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number | { tl: number; tr: number; br: number; bl: number } = 5,
    fill = false,
    stroke = true
  ) {
    if (typeof radius === "number") {
      radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
      radius = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius };
    }
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius.tl, y);
    this.ctx.lineTo(x + width - radius.tr, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    this.ctx.lineTo(x + width, y + height - radius.br);
    this.ctx.quadraticCurveTo(
      x + width,
      y + height,
      x + width - radius.br,
      y + height
    );
    this.ctx.lineTo(x + radius.bl, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    this.ctx.lineTo(x, y + radius.tl);
    this.ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    this.ctx.closePath();
    if (fill) {
      this.ctx.fill();
    }
    if (stroke) {
      this.ctx.stroke();
    }
  }

  drawBall() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.gameConfig.ball.collor;
    this.ctx.arc(
      this.gameConfig.states.ball.left + this.gameConfig.ball.diammeter / 2,
      this.gameConfig.states.ball.top + this.gameConfig.ball.diammeter / 2,
      this.gameConfig.ball.diammeter / 2,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
  }

  darken() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw() {
    // clear
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // draw net
    this.ctx.strokeStyle = "white";
    this.ctx.beginPath();
    this.ctx.setLineDash([5, 15]);
    this.ctx.moveTo(this.gameConfig.board.board.width / 2, 0);
    this.ctx.lineTo(
      this.gameConfig.board.board.width / 2,
      this.gameConfig.board.board.height
    );
    this.ctx.stroke();

    // draw left racket

    this.ctx.fillStyle = this.gameConfig.left.racket.color;
    this.roundRect(
      this.gameConfig.states.racketLeft.left,
      this.gameConfig.states.racketLeft.top,
      this.gameConfig.left.racket.width,
      this.gameConfig.left.racket.height,
      10,
      true,
      false
    );

    // draw left racket
    this.ctx.fillStyle = this.gameConfig.right.racket.color;
    this.roundRect(
      this.gameConfig.states.racketRight.left,
      this.gameConfig.states.racketRight.top,
      this.gameConfig.right.racket.width,
      this.gameConfig.right.racket.height,
      10,
      true,
      false
    );

    // draw ball
    this.drawBall();

    // draw score
    this.ctx.font = "30px Arial";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      String(this.gameConfig.states.scoreLeft),
      this.gameConfig.board.board.width * 0.4,
      this.gameConfig.board.board.height * 0.05
    );
    this.ctx.fillText(
      String(this.gameConfig.states.scoreRight),
      this.gameConfig.board.board.width * 0.6,
      this.gameConfig.board.board.height * 0.05
    );
  }
}
