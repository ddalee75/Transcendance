import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user';

@Component({
  selector: 'app-player-pong',
  templateUrl: './player-pong.component.html',
  styleUrls: ['./player-pong.component.css']
})
export class PlayerPongComponent implements OnInit {
@Input() user!: User;
  constructor() { }

  ngOnInit(): void {
    
     
  }

}


