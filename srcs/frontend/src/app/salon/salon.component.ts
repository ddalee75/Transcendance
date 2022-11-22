import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../services/api.service';
import { SocketService } from '../services/socket.service';
import { Channel } from '../models/channel';
import { User } from '../models/user';
import { Message } from '../models/message';



@Component({
  selector: 'app-salon',
  templateUrl: './salon.component.html',
  styleUrls: ['./salon.component.css']
})
export class SalonComponent implements OnInit {

  

  // guests:string[] = [];
  conversation: string[] = [];
  historiqueConv: Message[] = [];
  message: string= '';
  quit_salon:boolean=false;
  content: Message = {content: "", fromUserId: 0, fromUserName: ""};
  
  
  current_channel!:Channel;
  usersInGuest: User[] | undefined = [];
  usersAdmin:User[] =[];
  AdminOrNot!:boolean;
  CreatorId!:number;
  // CreatorId:number=this.current_channel.creator_id;


  

  @Output() QuitSalonEvent = new EventEmitter<boolean>();
  @Input() channel_name!:string;
  @Input() current_user!: User;
  constructor(private socketService: SocketService, private apiService: ApiService) {

   }

   async ngOnInit(): Promise<void> {
    await this.apiService.findChannelByName(this.channel_name).subscribe({
      next: (result) => {
        this.current_channel = result;
        // if (undefined != this.guest.joined)
        // console.log(result);
        if (this.current_channel != null && this.current_channel.joined !== undefined)
          this.usersInGuest=this.current_channel.joined;
        if (this.current_channel != null && this.current_channel.admins !== undefined)
        {
          this.usersAdmin=this.current_channel.admins;
        }  
        if (this.current_channel != null && this.current_channel.creator_id !== undefined)
        {
          this.CreatorId=this.current_channel.creator_id;
        }
        

      },
      error: (err) => {},
      complete: () => {}
    })
    ;
    (await this.socketService.getUpdateChannel()).subscribe((res) => {
      this.current_channel = res;
    })

    this.socketService.joinChannel(this.channel_name, this.current_user.id);

    this.socketService.updateUserList().subscribe({
      next: (result) => {
        console.log("triggered")
        console.log(result)
        this.usersInGuest = result;
      }
    });

    this.socketService.socketInTotoRoom();
    
    this.socketService.updateAdminList().subscribe({
      next: (result) => {
        this.usersAdmin = result;
      }
    })

    this.apiService.getChannelMessages(this.channel_name).subscribe({
      next:(result) => {
        this.historiqueConv = result;
        
        },
        error: (err) =>{},
        complete:() => {}
      })

    this.socketService.getMsgFromChannel().subscribe({
      next: (message: any) => {
        if (message.channel == this.channel_name)
          this.conversation.push(message.from + ": " + message.msg);
      },
      error: (err) =>{},
      complete:() => {}
    })
    
    this.socketService.amIBanned().subscribe({
      next: (data: {res : Number, res2 : Channel;}) => {
        if (Number(data.res) == Number(localStorage.getItem("id")))
        {
          this.socketService.updateUser(this.current_user);
           this.quitSalon();
          window.alert("You just got banned from this channel.")
        }
        else{
          this.usersInGuest = data.res2.joined;
        }
      }
    })
  }
  
  ngOnDestroy(){
	this.socketService.unsubsribeChannelEvent();
  }

  isCreator(current:User){
    if (this.current_channel.creator_id==current.id)
      return 1;
    return 0;
  }

  isAdmin(current: User)
  {
    let i = 0;
    while (this.usersAdmin[i] != null && this.usersAdmin[i] != undefined)
    {
      if (this.usersAdmin[i].id == current.id)
        return 1;
      i++;
    }
    return 0
  }

  isMuted(current: User)
  {
    let i = 0
    while(this.current_channel.muted != null && this.current_channel.muted != undefined
      && this.current_channel.muted[i] != null && this.current_channel.muted[i] != undefined)
      {
        if (this.current_channel.muted[i].id == current.id)
          return 1
        i++;
      }
      return 0
  }

  setUpContent()
  {
    this.content.channelName = this.channel_name;
    this.content.content = this.message;
    this.content.fromUserId = this.current_user.id;
    this.content.fromUserName = this.current_user.nickname;
  }

  sendMessage()
  {
    if(this.isMuted(this.current_user) != 1)
    {
      console.log(this.message);
      this.setUpContent();
      this.apiService.createChannelMessage(this.content).subscribe();
      this.socketService.sendMsgToChannel(this.channel_name, this.message, this.current_user.nickname)
      // this.conversation.push(this.message);
      this.message= '';
      this.content = {content: "", fromUserId: 0, fromUserName: ""};
    }
    else{
      this.message= '';
      window.alert("You are muted at the moment");
    }
  }

  quitSalon(){
    this.socketService.leaveChannel(this.channel_name, this.current_user.id);
    this.QuitSalonEvent.emit(this.quit_salon);
  }

  pauseSalon() {
    this.QuitSalonEvent.emit(this.quit_salon);
    
  }
  
}
