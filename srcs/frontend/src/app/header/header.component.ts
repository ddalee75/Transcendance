import { Component, OnInit, Input, Injectable } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';

@Injectable()
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	constructor(private storage: StorageService,
		private socketService: SocketService,
		private authService: AuthService) { }

	login = this.storage.getLogin();

	ngOnInit(): void {
		this.socketService.sendLogin(String(this.login)); //obtenir son socket
		this.socketService.imConnected(String(this.login));
	}

	async logout() {
		this.socketService.imDisconnected(String(this.login));
		this.authService.logout();
	}
}
