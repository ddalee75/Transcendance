import { Component, OnInit, Input } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { ApiService } from '../services/api.service';
import { User } from '../models/user'
import { Message } from '../models/message';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-direct-chat',
  templateUrl: './direct-chat.component.html',
  styleUrls: ['./direct-chat.component.css']
})
export class DirectChatComponent implements OnInit {
  
  @ViewChild('scrollMe') 
  comment! : ElementRef;  
  scrolltop: number = 0 ;

  @Input() Me!: User;
  @Input() Dest!: User;
  @Input() friendOrNot:boolean=true;
  @Input() messages: String[] = [];

  message: string = '';
  to_create!: Message;
  friend: string="Add friend";
  bloque: string="Block";
  bloqueOrNot: boolean=true;
  roomName !:string;
  num!: number;
  old_messages: Message[] = [];
  friendList!: User[];

  constructor(private socketService: SocketService,
              private apiService: ApiService,
              public router:Router) {}

              ngDoCheck() {
                this.updateScroll();
              }

  async ngOnInit(): Promise<void> {
    
    this.socketService.destActualisation().subscribe((res) => {
      for (let i = this.old_messages.length; i > 0; i--) {
        this.old_messages.pop();
      }
      for (let i = this.messages.length; i > 0; i--) {
        this.messages.pop();
      }
      this.Dest = res;
      this.apiService.getMessages(this.Me.id, this.Dest.id,).subscribe(
        {
          next:(result) => {
          this.old_messages = result;
          },
          error: (err) =>{},
          complete:() => {
          }
        
        })
    })

    this.socketService.getMessage().subscribe( {
      next:(message: any) => {
        if (this.getRoomName(this.Me.login, this.Dest.login) == message.channel)
        {  
          this.messages.push(message.from + ": " + message.msg);
      }
    },
    error: (err) =>{},
    complete:() => {}
    });
    
    this.socketService.findFriendsOrNot().subscribe((result) => {
      this.num = result;
      // console.log(this.num);
      if (this.num == 1)
      {
        this.friendOrNot=false;
        this.friend = "Del friend";
      }
      else{
        this.friendOrNot=true;
        this.friend = "Add friend";
      }
    })

    this.socketService.findBlockOrNot().subscribe((result) => {
      this.num = result;
      if (this.num == 0)
      {
        this.bloqueOrNot = true;
        this.bloque = "Block";
      }
      else
      {
        this.bloqueOrNot = false;
        this.bloque = "Unblock";
      }
      
    })

    this.socketService.unblockedUser().subscribe((result) => {
      // this.friendList = result;
      this.bloqueOrNot = true;
      this.socketService.hasBeenUnblocked(this.Dest, this.Me);
    })

    this.socketService.blockedUser().subscribe((result) => {
      // this.friendList = result;
      this.bloqueOrNot = false;
      this.socketService.hasBeenBlocked(this.Dest, this.Me);
    })

    this.socketService.getFriend().subscribe((result) => {      
    })

    this.socketService.removeFriend().subscribe((result) => {
    })

  }
  
  getRoomName(login1: string, login2 : string) : string
  {
    let result : string;

    if (login1 < login2)
      result = login1 + login2;
    else
      result = login2 + login1;
    return result
  }

  sendMessage() {
    this.socketService.sendMessageTo(this.message, this.Me.login,this.Dest.login, this.Me.nickname);
    this.apiService.createMessage({userId: this.Dest.id, fromUserName: this.Me.nickname , fromUserId: this.Me.id, content: this.message}).subscribe((result)=>{
    });
    this.message = "";
  }

  addDelFriend(){
    this.friend = this.friendOrNot?"Del friend":"Add friend";
    if (this.friendOrNot == true)
    {
      this.socketService.getAddFriend(this.Me.id, this.Dest.id);
      this.friendOrNot = false;
    }
    else
    {
      this.socketService.getRemoveFriend(this.Me.id, this.Dest.id);
      this.friendOrNot = true;
    }
  }

  blockOrNot(){
        this.bloque = this.bloqueOrNot?"UnBlock":"Block";
    if (this.bloqueOrNot === true)
    {
      this.socketService.getBlockUser(this.Me.id, this.Dest.id);
      this.socketService.getRemoveFriend(this.Me.id, this.Dest.id);
      this.friendOrNot = false;
    }
    else
    {
      this.socketService.getUnblockUser(this.Me.id, this.Dest.id);
      this.friendOrNot = true;
      this.friend = "Add friend";

    }
  }

  invite_game(){
    this.socketService.displayInvitation(this.Dest, this.Me);

  }


  goToProfile() {

    this.socketService.searchForAUser(this.Dest.login);
  }
  
  updateScroll() {
   
    if (this.comment)
      this.scrolltop = this.comment.nativeElement.scrollHeight;
  }

}
