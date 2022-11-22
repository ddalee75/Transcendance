import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { User } from '../../models/user'
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-invitation-refuse',
  templateUrl: './invitation-refuse.component.html',
  styleUrls: ['./invitation-refuse.component.css']
})
export class InvitationRefuseComponent implements OnInit {

  @Input() refuseFromWho!: User;
  
  @Input() to!: User;
  @Output() refuseInvitationEvent = new EventEmitter<boolean>();

  toDisplay: boolean = false;
 
  gameAccepted: boolean = false;
  gameIsReady: boolean = false;

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {

    // this.socketService.doIHaveToDisplay().subscribe((res) => {
    //   this.toDisplay = res;
    // })

    
    this.socketService.isGameAccepted().subscribe((res) => {
      this.gameAccepted = res;
    })

    this.socketService.isGameReady().subscribe((res) => {
      this.gameIsReady = res;
    })
  }

  okGotIt(){

    this.refuseInvitationEvent.emit(false);
    
  }


}
