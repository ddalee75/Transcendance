import { Component, OnInit,Input } from '@angular/core';
import { Channel } from 'src/app/models/channel';
import { User } from 'src/app/models/user';
import { StorageService } from 'src/app/services/storage.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-creator-in-salon',
  templateUrl: './creator-in-salon.component.html',
  styleUrls: ['./creator-in-salon.component.css']
})

export class CreatorInSalonComponent implements OnInit {
  @Input() guest!: User;
  @Input() current_user!:User;
  @Input() current_channel!: Channel;


  new_pwd! : string;
  show_pwd: boolean=false;
  cancel: string= "";
  CanUchangePwd: boolean =false;
  
  


  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    if (this.guest.id == this.current_user.id){
      this.CanUchangePwd=true;
    }
    

  }

  showFormule(){
    this.show_pwd=! this.show_pwd;

  }

  async resetPwd(){
  
    if(this.new_pwd != undefined || this.new_pwd != null)
    {
      this.show_pwd=false;
      if (this.current_channel.creator_id == this.guest.id)
      {
        this.socketService.resetChannelPassword(this.current_channel, this.new_pwd)
      }
      this.new_pwd ="";
    }
    else{
      window.alert("New Password Please!");
    }

  }

  async cancelPwd(){

    if(this.new_pwd == undefined || this.new_pwd == null)
    {
      this.show_pwd=false;
      if (this.current_channel.creator_id == this.guest.id)
      {
        this.socketService.resetChannelPassword(this.current_channel, this.new_pwd)
      }
    }
    else{
      window.alert("Please use reset PWD");
    }
  }


}
