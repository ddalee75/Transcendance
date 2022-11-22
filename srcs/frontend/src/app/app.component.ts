import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from './services/socket.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
	constructor(
    public route: ActivatedRoute,
		public router: Router,
    private socketService: SocketService){
  }

  invitation:boolean=false;
  invitationFromWho! :User;
  refuse:boolean=false;
  refuseFromWho! : User;

  ngOnInit(): void {
    // this.socketService.doIHaveToDisplay().subscribe((res) => {
    //   this.invitation = res;
    // })

    this.socketService.doIHaveToDisplay().subscribe({
      next: (data: {res: boolean, res2:User;}) =>{
      this.invitation = data.res;
      this.invitationFromWho = data.res2;
      }
    })

    this.socketService.showrefuseInvitation().subscribe({
      next: (data: {res: boolean, res2:User;}) =>{
      this.refuse = data.res;
      this.refuseFromWho = data.res2;
      }
    })
  }

  public getLogin(): string | null{
	var login = localStorage.getItem("login");
  this.socketService.sendLogin(String(login)); //mettre son socket a jour
	if (login == undefined) {
		return null;
	}
	return login;
  }

  public getRoute() {
	return this.router.url.split("?")[0];
  }

  receiveShowInivtationEvent($event: boolean){
    this.invitation = $event;
  }

  receiverefueInvitationEvent($event: boolean){
    this.refuse = $event;
  }

}
