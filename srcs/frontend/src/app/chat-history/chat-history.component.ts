import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../services/api.service';
import { SocketService } from '../services/socket.service';
import { User } from '../models/user'
import { Message } from '../models/message'

@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.css']
})


export class ChatHistoryComponent implements OnInit {
  
 
  @Input() Me!: User;
  @Input() Dest!: User;
  tmp : Message = {fromUserId : 0, fromUserName : "", userId : 0, content : ""}
  messages: Message[] = [];
  constructor(private apiService: ApiService, private socketService: SocketService) {}

  //potentiellement besoin de await si on vois que les messages ne se chargent pas
  async ngOnInit(): Promise<void> {
    this.apiService.getMessages(this.Me.id, this.Dest.id,).subscribe(
    {
      next:(result) => {
      this.messages = result;
      // console.log("ici chat history : " + result[0].content)
      },
      error: (err) =>{},
      complete:() => {}
  
    })
  }
}
