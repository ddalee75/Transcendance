import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { User } from '../../models/user'
import { SocketService } from '../../services/socket.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-invitation-game',
  templateUrl: './invitation-game.component.html',
  styleUrls: ['./invitation-game.component.css']
})
export class InvitationGameComponent implements OnInit {

  @Input() fromWho!: User;
  @Input() to!: User;
  @Output() showInvitationEvent = new EventEmitter<boolean>();

  toDisplay: boolean = false;
  gameAccepted: boolean = false;
  gameIsReady: boolean = false;

  constructor(private socketService: SocketService, private storageService: StorageService) {}

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

  Nothanks(){

    this.socketService.refuseInvitation(this.fromWho, String(this.storageService.getLogin()));
    this.showInvitationEvent.emit(false);
    
  }


}
