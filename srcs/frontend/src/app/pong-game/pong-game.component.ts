import { Component, Input, OnInit } from '@angular/core';
import { IGame } from '../pong/game/interfaces/game.interface';

@Component({
  selector: 'app-pong-game',
  templateUrl: './pong-game.component.html',
  styleUrls: ['./pong-game.component.css']
})
export class PongGameComponent implements OnInit {
  @Input()
  game!: IGame;

  constructor() { }

  ngOnInit(): void {
  }

}
