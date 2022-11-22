import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Channel } from 'src/app/models/channel';
import { User } from 'src/app/models/user';
import { SocketService } from 'src/app/services/socket.service';


@Component({
  selector: 'app-user-in-salon',
  templateUrl: './user-in-salon.component.html',
  styleUrls: ['./user-in-salon.component.css']
})
export class UserInSalonComponent implements OnInit {

  @Input() guest!: User;
  @Input() current_channel !: Channel;
  @Input() usersAdmin:User[] =[];
  @Input() AdminOrNot:boolean=false;

  ifAdmin:boolean=false;
  ifMuet:boolean=false;
  ifBanne:boolean=false;
  val_admin:string="Be Admin";
  val_muet:string="Muet(Secondes)";
  val_banne:string="Ban(Secondes)";
  showOption: boolean=false;
  color1:string="rgb(44, 136, 125)";
  color2:string="rgb(44, 136, 125)";
  color3:string="rgb(44, 136, 125)";
  countTimeMuet:boolean= true;
  countTimeBan:boolean=true;
  time_muet:number = 0;
  time_ban:number = 0;

  constructor(private socketService: SocketService) {
   }

  ngOnInit(): void {
  }

  isAdmin2()
  {
    let i = 0;
    while (this.usersAdmin[i] != null && this.usersAdmin[i] != undefined)
    {
      if (this.usersAdmin[i].id == Number(localStorage.getItem('id')))
        return 1;
      i++;
    }

    return 0
  }

  show_info(){

    this.showOption = this.showOption?false:true;
  }
   
  beAdmin(){
    this.ifAdmin=!this.ifAdmin;
   
    if (this.val_admin=="Be Admin")
    {
        this.socketService.BeAdminSalon(this.guest.id, Number(this.current_channel.id));
    }
    this.socketService.updateUserInSalonList(this.current_channel.name);
    this.val_admin=this.ifAdmin?"Del Admin":"Be Admin";
    this.color1=this.ifAdmin?"rgb(76, 80, 79)":"rgb(44, 136, 125)";
      
  }
  
  beMuet(){
    this.ifMuet=!this.ifMuet;
    this.color2=this.ifMuet?"rgb(76, 80, 79)":"rgb(44, 136, 125)";
    this.countTimeMuet=!this.countTimeMuet;
    if (this.val_muet == "Muet(Secondes)")
    {
      if (this.time_muet != 0)
      {
        this.socketService.muteUserByTime(this.guest.id, Number(this.current_channel.id), this.time_muet);
      }
      else
      {
        this.socketService.muteUser(this.guest.id, Number(this.current_channel.id));
      }
    }
    else{
      this.socketService.unmuteUser(this.guest.id, Number(this.current_channel.id));
    }
    this.val_muet=this.ifMuet?"Not Muet":"Muet(Secondes)";
    this.socketService.updateChannel();
    this.socketService.updateChannels();
    this.time_muet = 0;
  }

  beBanne(){
    this.ifBanne=!this.ifBanne;
    this.color3=this.ifBanne?"rgb(76, 80, 79)":"rgb(44, 136, 125)";
    this.countTimeBan=!this.countTimeBan;
    console.log("val ban = " + this.val_banne);
    if(this.val_banne == "Ban(Secondes)"){
      console.log("val time ban = " + this.time_ban);
      if (this.time_ban != 0)
        this.socketService.banUserByTime(this.guest.id, Number(this.current_channel.id), this.time_ban);
      else
        this.socketService.banUser(this.guest.id, Number(this.current_channel.id));
    //   this.socketService.leaveChannel(this.current_channel.name, this.guest.id);
    }
    else{
      this.socketService.unbanUser(this.guest.id, Number(this.current_channel.id));
    }
    this.val_banne=this.ifBanne?"Unban":"Ban(Secondes)";
    this.socketService.updateChannel();
    this.socketService.updateChannels();
    this.time_ban = 0;
    // this.socketService.updateUserInSalonList(this.current_channel.name);
  }

}
