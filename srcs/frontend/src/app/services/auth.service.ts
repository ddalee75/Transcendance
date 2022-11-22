import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { ApiService } from './api.service';
import { SocketService } from './socket.service';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class AuthService {

	constructor(private route: ActivatedRoute,
				private router: Router,
				private storageService: StorageService,
				private apiService: ApiService,
				private socketService: SocketService) {}

	INTRA_API_AUTH = "https://api.intra.42.fr/oauth/authorize";
	private code: string = this.storageService.getCode();
	private locked: boolean = true;
	private tfa: boolean = false;

	goToIntraLoginPage() {
			window.location.href = `${this.INTRA_API_AUTH}?client_id=${environment.INTRA_UID}&redirect_uri=https%3A%2F%2Flocalhost%3A8081&response_type=code`;
	}

	async getCode(): Promise<boolean> {
		return new Promise<boolean>(resolve => {
			this.route.queryParams.subscribe(async (params) => {
				if (params['code']) {
					this.code = params['code'];
					const result = this.postCode();
					if (await result === true)
						this.tfa = true;
					else
						this.storageService.setCode(this.code);
				}
				resolve(this.tfa);
		})});
	}

	async postCode() {
		return new Promise<User | boolean>(resolve => {
			if (this.code)
				this.apiService.signup(this.code).subscribe({
					next: async (result) => {
						if (typeof (result) != "boolean" && result) {
							if (await this.initUser(result)) {
								this.locked = false;
								this.router.navigate(["../home"], { relativeTo: this.route });
							}
						}
						resolve(result);
					}
				})
		});
	}

	async validateTfaCode(tfaCode: string): Promise<User | boolean> {
		return new Promise<User | boolean>(resolve => {
			if (this.code && this.code !== "") {
				this.apiService.validateTfa({ code: this.code, tfa_key: tfaCode }).subscribe({
					next: async (result) => {
						if (typeof (result) != "boolean" && result) {
							if (await this.initUser(result)) {
								this.locked = false;
								this.tfa = false;
								this.storageService.setCode(this.code);
								this.router.navigate(["../home"], { relativeTo: this.route });
							}
						}
						resolve(result);
					}
				});
			}
		});
	}

	async initUser(user: User) {
		if (user.oauth !== undefined) {
			this.storageService.setTfa(user.oauth.tfa?.tfa_activated);
		}
		if (this.storageService.setId(user.id) &&
		this.storageService.setEmail(user.email) &&
		this.storageService.setLogin(user.login) &&
		this.storageService.setFirstName(user.first_name) &&
		this.storageService.setLastName(user.last_name) &&
		this.storageService.setUrl(user.url) &&
		this.storageService.setDisplayName(user.displayname) &&
		this.storageService.setNickName(user.nickname) &&
		this.storageService.setImage(user.image) &&
		this.storageService.setAvatar(user.avatar)) {
			return true;
		} else {
			return false
		}
	}

	logout() {
		this.storageService.clear();
		this.code = "";
		this.router.navigate(["../"], {relativeTo: this.route}); 
		this.locked = true;
	}
	
	getTfa() {
		return this.tfa;
	}

	getLocked() {
		return this.locked;
	}

	async userIsOnline() {
		return new Promise<boolean>((resolve) => {
			this.apiService.userInfo(this.code).subscribe({
				next: (result) => {
					resolve(result);
				}
			});
		});
	}
}
