import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Channel } from 'src/app/models/channel';
import { User } from 'src/app/models/user';
import { SocketService } from 'src/app/services/socket.service';


@Component({
  selector: 'app-admin-in-salon',
  templateUrl: './admin-in-salon.component.html',
  styleUrls: ['./admin-in-salon.component.css']
})
export class AdminInSalonComponent implements OnInit {

  @Input() guest!: User;
  @Input() current_channel!: Channel;

  ifAdmin: boolean = false;
  ifMuet: boolean = false;
  ifBanne: boolean = false;
  val_admin: string = "Del Admin";
  val_muet: string = "Muet(Secondes)";
  val_banne: string = "Ban(Secondes)";
  showOption: boolean = false;
  color1: string = "rgb(76, 80, 79)";
  color2: string = "rgb(44, 136, 125)";
  color3: string = "rgb(44, 136, 125)";
  time_ban!: number;
  countTimeMuet: boolean = true;
  countTimeBan: boolean = true;
  time_muet!: number;


  @Input() CreatorId!: number;
  @Input() usersAdmin: User[] = [];
  @Input() AdminOrNot: boolean = false;

  constructor(private socketService: SocketService) {
  }

  ngOnInit(): void {

  }

  isCreator() {
    if (Number(localStorage.getItem('id')) == this.CreatorId)
      return 1;
    return 0;
  }

  show_info() {

    this.showOption = this.showOption ? false : true;
  }

  delAdmin() {
    this.ifAdmin = !this.ifAdmin;

    console.log(22)
    this.socketService.delAdminSalon(this.guest.id, Number(this.current_channel.id));

    this.socketService.updateUserInSalonList(this.current_channel.name);

    this.val_admin = this.ifAdmin ? "Del Admin" : "Be Admin";
    this.color1 = this.ifAdmin ? "rgb(76, 80, 79)" : "rgb(44, 136, 125)";

  }

  beMuet() {
    this.ifMuet = !this.ifMuet;
    this.val_muet = this.ifMuet ? "Not Muet" : "Muet(secondes)";
    this.color2 = this.ifMuet ? "rgb(76, 80, 79)" : "rgb(44, 136, 125)";
    this.countTimeMuet = !this.countTimeMuet;
    if (this.val_muet == "Not Muet") {
      if (this.time_muet != 0)
        this.socketService.muteUserByTime(this.guest.id, Number(this.current_channel.id), this.time_muet);
      else
        this.socketService.muteUser(this.guest.id, Number(this.current_channel.id));
    }
    else {
      this.socketService.unmuteUser(this.guest.id, Number(this.current_channel.id));
    }
    this.socketService.updateChannel();
    this.socketService.updateChannels();
  }

  beBanne() {
    this.ifBanne = !this.ifBanne;
    this.val_banne = this.ifBanne ? "Unban" : "Ban(Secondes)";
    this.color3 = this.ifBanne ? "rgb(76, 80, 79)" : "rgb(44, 136, 125)";
    this.countTimeBan = !this.countTimeBan;
    if (this.val_banne == "Unban") {
      if (this.time_ban != 0)
        this.socketService.banUserByTime(this.guest.id, Number(this.current_channel.id), this.time_ban);
      else
        this.socketService.banUser(this.guest.id, Number(this.current_channel.id));
    //   this.socketService.leaveChannel(this.current_channel.name, this.guest.id);
    }
    else {
      this.socketService.unbanUser(this.guest.id, Number(this.current_channel.id));
    }
    this.socketService.updateChannel();
    this.socketService.updateChannels();
    //this.socketService.updateUserInSalonList(this.current_channel.name);
  }
}
