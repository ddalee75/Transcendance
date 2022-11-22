import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-show-room',
  templateUrl: './show-room.component.html',
  styleUrls: ['./show-room.component.css']
})


export class ShowRoomComponent implements OnInit {

  matches: string[] = []; 
  constructor(service: ApiService) { 
    //  this.matches = service.getMatches();
    
  }

  ngOnInit(): void {
  }

}
