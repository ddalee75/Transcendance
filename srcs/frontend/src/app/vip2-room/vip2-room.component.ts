
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { SocketService } from '../services/socket.service';
import { User } from '../models/user';
import { share } from 'rxjs';
import { StorageService } from '../services/storage.service'

@Component({
  selector: 'app-vip2-room',
  templateUrl: './vip2-room.component.html',
  styleUrls: ['./vip2-room.component.css']
})

export class Vip2RoomComponent implements OnInit {
	visible:boolean = false;
	visible_avatar:boolean = false;
	visible_nickname:boolean = false;
	
	userToShow: User = {
		login: String(localStorage.getItem("login")),
		displayname: String(localStorage.getItem("displayname")),
		image: String(localStorage.getItem("image")),
		avatar: String(localStorage.getItem("avatar")),
		nickname: String(localStorage.getItem("nickname")),
		id: Number(localStorage.getItem("id")),
		online: true,
		email: "",
		first_name: "",
		last_name: "",
		url: String(localStorage.getItem("avatar"))
	};
	login = localStorage.getItem("login");
	displayname = localStorage.getItem("displayname");
	image = localStorage.getItem("image");
	avatar = localStorage.getItem("avatar");
	nickname = localStorage.getItem("nickname");
	id = localStorage.getItem("id");
	newNickName!:string;
	searchName:string = "";
	
	constructor(private apiService: ApiService,
		private http: HttpClient,
		private storage: StorageService,
		private socketService: SocketService) {
			this.qrCode = this.storage.getQrCode();
	}
		tfa_auth: boolean = false;
		tfa_validation: boolean = false;
		qrCode: string = "";
		tfa_key: string = "";
		tfa_count: number = 3;
		url = this.avatar;
		selectedFile! : File;

	
	onSelect(event) {
		
		this.selectedFile =event.target.files[0];
		let fileType = event.target.files[0].type;
		if (fileType.match(/image\/*/)) {
		let reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		reader.onload = (event: any) => {
			this.userToShow.url = event.target.result;
			console.log("avatar url:" + this.avatar);
			console.log("new avatar url" + this.userToShow.url);
			// console.log(event);
		};
		} else {
		window.alert('Please select correct image format');
		}
	}

	onUpload(){
		
		if (this.selectedFile.size < 75000){
		this.apiService.updateAvatar(Number(this.id), String(this.userToShow.url)).subscribe();
		console.log("this.url")
		localStorage.setItem('avatar_url', String(this.userToShow.url));
		window.alert('***Update down***');
		}
		else{
			window.alert('***image too large only < 75kb ***');
		}
	}

	ngOnInit(): void {
		this.socketService.waitForAUser().subscribe((res) => {
		this.userToShow = res;
		})
		this.tfa_auth = this.storage.getTwoFactorAuth();
		this.qrCode = this.storage.getQrCode();
	}


	showhide() {
		this.visible = this.visible ? false : true;
		this.visible_nickname = false;
		this.visible_avatar = false;
	}

	changeNickname(){
		this.apiService.updateNickName(Number(this.id), this.newNickName).subscribe();
		localStorage.setItem('nickname', this.newNickName)
		this.newNickName = "";
		window.alert('***Nickname changed. Reload page ***');

	}

	searchProfile(){
		this.socketService.searchForAUser(this.searchName);
	}

	backtoMyself(){
		this.socketService.searchForAUser(String(this.login));
	}

	showhide_nickname() {
		this.visible_nickname = this.visible_nickname ? false : true;
		this.visible_avatar = false;
		this.tfa_auth = false;
		this.tfa_validation = false;
	}
	
	showhide_avatar() {
		this.visible_avatar = this.visible_avatar ? false : true;
		this.visible_nickname = false;
		this.tfa_auth = false;
		this.tfa_validation = false;
	}
	tfa_signup() {
		this.apiService.signupTfa(this.storage.getCode()).subscribe({
			next: (result) => {
				if (result.tfa_qr) {
					this.storage.setQrCode(result.tfa_qr);
					this.qrCode = result.tfa_qr;
				}
				this.tfa_auth = true;
				this.tfa_validation = true;
				this.visible_avatar =false;
				this.visible_nickname=false;
			}
		});
	}

	tfa_disable() {

		
		this.visible_nickname = false;
		this.visible_avatar = false;
		this.apiService.disableTfa(this.storage.getCode()).subscribe({
			next: (result) => {
				this.storage.setQrCode(undefined);
				this.qrCode = "";
				this.tfa_auth = false
				this.tfa_validation = false;
				
			},
		});
		
	}

	tfa_verify() {
		this.apiService.verifyTfa({code : this.storage.getCode(), tfa_key: this.tfa_key}).subscribe({
			next: (result) => {
				console.log(result);
				if (result) {
					this.tfa_validation = false;
					this.storage.setTfa(true);
				}
				else if (this.tfa_count < 2) {
					this.tfa_auth = false;
					this.tfa_count = 3;
					this.tfa_validation = false;
					this.tfa_disable();
				}
				else
					this.tfa_count--;
				this.tfa_key = "";
			},
		});
	}
}

