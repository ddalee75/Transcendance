import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../services/api.service';
import {Channel} from '../../models/channel'
import{ User } from '../../models/user'
import { SocketService } from '../../services/socket.service';


@Component({
  selector: 'app-salon-available',
  templateUrl: './salon-available.component.html',
  styleUrls: ['./salon-available.component.css']
})



export class SalonAvailableComponent implements OnInit {

  show_salon: boolean=true;
  show_formulePassword: boolean=false;
  you_got_message:boolean=true;
  icon_message!:string;

 
 
  @Output() ShowChannelPublicEvent= new EventEmitter<boolean>();
  @Output() SendJoinChannelNameEvent = new EventEmitter<string>();
  @Output() ShowFormulePasswordEvent = new EventEmitter<boolean>();
  @Output() showchatEvent = new EventEmitter<boolean>();
  @Output() showFormuleEvent = new EventEmitter<boolean>();
  @Output() SendChannelEvent = new EventEmitter<Channel>();
  


  salons_dispos: Channel[] = [];
  @Input() current_user !:User;
  
  constructor(private apiService:ApiService, private socketService: SocketService) {

   }

  async ngOnInit(): Promise<void> {
    await this.apiService.getAllChannels().subscribe({
      next: (result) => {
        this.salons_dispos = result;
      },
      error: (err) => {},
      complete: () => {}
    }
    )

    if (this.you_got_message==true){
      this.icon_message="📨";
   }
    else{
      this.icon_message="";
    }
    
    this.socketService.updateChannelList().subscribe({
      next: (result) => {
        this.salons_dispos = result;
      }
    })
    this.socketService.updateChannel();
    ;(await this.socketService.getUpdateChannels()).subscribe({
      next: (result) => {
        this.salons_dispos = result;
      }
    })

    this.socketService.getUserUpdated().subscribe(res => {
      this.current_user = res;
    })

    this.socketService.updateUser(this.current_user);

    this.socketService.updateChannels();
  }

  isBanned(current_user: User, current_channel : Channel)
  {
    console.log(current_user);
    let i = 0;
    while(current_user.banned != null && current_user.banned != undefined
      && current_user.banned[i] != null && current_user.banned[i] != undefined)
      {
        if (current_user.banned[i].id == current_channel.id)
          return 1
        i++;
      }
      console.log("pas ban")
      return 0
  }

  joinChannel(current_channel: Channel, current_user: User)
  {
    this.socketService.updateUser(this.current_user);
    if(this.isBanned(current_user, current_channel) != 1)
    {
      console.log("console log la")
      this.socketService.joinChannel(current_channel.name, this.current_user.id);
      this.ShowChannelPublicEvent.emit(this.show_salon);
      this.SendJoinChannelNameEvent.emit(current_channel.name);
      this.show_formulePassword=false;
      this.ShowFormulePasswordEvent.emit(this.show_formulePassword);
    }
    else{
      window.alert("Your are banned from this channel.")
    }
  }

  showFormulePassword(current_channel: Channel){
    this.showchatEvent.emit(false);
    this.show_formulePassword= true;
    this.ShowFormulePasswordEvent.emit(this.show_formulePassword);
    this.SendChannelEvent.emit(current_channel);
    this.SendJoinChannelNameEvent.emit(current_channel.name);
    
    // this.showchatEvent.emit(false);
    this.showFormuleEvent.emit(false);
  }
}
