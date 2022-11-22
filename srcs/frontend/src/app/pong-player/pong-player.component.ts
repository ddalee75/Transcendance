import { Component, Input, OnInit } from '@angular/core';
import { IPlayer } from '../pong/game/interfaces/player.interface';

@Component({
  selector: 'app-pong-player',
  templateUrl: './pong-player.component.html',
  styleUrls: ['./pong-player.component.css']
})
export class PongPlayerComponent implements OnInit {
  @Input()
  player!: IPlayer;

  constructor() { }

  ngOnInit(): void {
  }

}
