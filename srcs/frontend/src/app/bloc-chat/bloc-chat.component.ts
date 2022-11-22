import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bloc-chat',
  templateUrl: './bloc-chat.component.html',
  styleUrls: ['./bloc-chat.component.css']
})
export class BlocChatComponent implements OnInit {

  
  constructor() { }

  ngOnInit(): void {
  }

  buttonTitle:string = "Show";
  visible:boolean = false;
  visible2:boolean = true;
  color:string= "rgb(50, 53, 60)";
  lien: string = "../../assets/icons/chatroom-f.jpg"
  
  showhide(){
    this.visible = this.visible?false:true;
    this.buttonTitle = this.visible?"Quit":"Show";
    this.color = this.visible?"rgb(48,156,120)":"rgb(50, 53, 60)";
    this.lien = this.visible?"":"../../assets/icons/chatroom-f.jpg";
    this.visible2 = this.visible2?false:true;
  }

  // ouvre_popup() {
  //   window.open("index.html", "", "width=400, height=600");
  //  }

}
