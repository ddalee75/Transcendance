import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import{ User } from '../../models/user'
import { Channel } from 'src/app/models/channel';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

  channel_password!:string;
  allowed: boolean = false;
  
  @Output() ShowChannelPrivateEvent= new EventEmitter<boolean>();
  @Output() ShowFormulePasswordEvent = new EventEmitter<boolean>();

  @Input() current_user !:User;
  @Input() channel!:Channel;

  // channel_name!:string;
  
  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.socketService.getPassVerifResponse().subscribe((res) => {
      this.allowed = res;
    if (this.allowed == true)
    {
      this.ShowChannelPrivateEvent.emit(true);
      this.ShowFormulePasswordEvent.emit(false);
    }
    else
    {
      window.alert('Wrong Password or No Password');
    }
    })
  }
  
  ngOnDestroy()
  {
    this.socketService.stopListeningPassVerifResponse();
  }

  async enterSalon(){

    this.socketService.verifyPassword(this.channel_password, this.channel.name);
    // if (this.channel_password==this.channel.password){ 

    //     this.ShowChannelPrivateEvent.emit(true);
    //     this.ShowFormulePasswordEvent.emit(false);
    
    // }
    // if (this.channel_password==null || this.channel_password!==this.channel.password){
    //   window.alert('Wrong Password or No Password');
    // }
  }



}
