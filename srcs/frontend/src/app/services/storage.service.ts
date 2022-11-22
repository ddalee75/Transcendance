
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from './api.service';

@Injectable({
	providedIn: 'root',
})
export class StorageService {
	constructor(private apiService: ApiService,
		private cookieService: CookieService) {
	}

	getCode(): string {
		let code = this.cookieService.get('code');
		if (code === null || code == undefined)
			return "";
		return code;
	}

	getId(): number {
		let id = localStorage.getItem("id");
		if (id === null || id == undefined)
			return 0;
		return Number(id);
	}

	getLogin(): string {
		let login = localStorage.getItem("login");
		if (login === null || login === undefined)
			return "";
		return login;
	}

	getEmail(): string {
		let email = localStorage.getItem("email");
		if (email === null || email === undefined)
			return "";
		return email;
	}

	getFirstName(): string {
		let first_name = localStorage.getItem("first_name");
		if (first_name === null || first_name === undefined)
			return "";
		return first_name;
	}

	getLastName(): string {
		let last_name = localStorage.getItem("last_name");
		if (last_name === null || last_name === undefined)
			return "";
		return last_name;
	}

	getUrl(): string {
		let url = localStorage.getItem("url");
		if (url === null || url === undefined)
			return "";
		return url;
	}

	getDisplayName(): string {
		let display_name = localStorage.getItem("display_name");
		if (display_name === null || display_name === undefined)
			return "";
		return display_name;
	}

	getNickName(): string {
		let nickname = localStorage.getItem("nickname");
		if (nickname === null || nickname === undefined)
			return "";
		return nickname;

	}

	getImage(): string {
		let image = localStorage.getItem("image");
		if (image === null || image === undefined)
			return "";
		return image;
	}

	getAvatar(): string {
		let avatar = localStorage.getItem("avatar");
		if (avatar === null || avatar === undefined)
			return "";
		return avatar;

	}

	getOnline(): boolean {
		let online = localStorage.getItem("online");
		if (online === "true")
			return true
		else
			return false
	}

	getTwoFactorAuthVerbose(): string {
		let two_factor_auth = localStorage.getItem("two_factor_auth");
		if (two_factor_auth === "true")
			return "Enabled";
		return "Disabled";
	}

	getTwoFactorAuth(): boolean {
		let two_factor_auth = localStorage.getItem("two_factor_auth");
		if (two_factor_auth === "true")
			return true;
		return false;
	}

	getQrCode(): string {
		var qrCode = localStorage.getItem("qrCode");
		if (qrCode === null || qrCode === undefined || qrCode === "null")
			return "";
		return qrCode;
	}

	setCode(code: string | undefined) {
		if (code === undefined)
			return false;
		this.cookieService.set('code', code);
		return true;
	}

	setId(id: number) {
		if (id) {
			localStorage.setItem("id", id.toString());
			return true;
		}
		return false;
	}

	setLogin(login: string) {
		if (login) {
			localStorage.setItem("login", login);
			return true;
		}
		return false;
	}

	setEmail(email: string) {
		if (email) {
			localStorage.setItem("email", email);
			return true;
		}
		return false;
	}

	setFirstName(first_name: string) {
		if (first_name) {
			localStorage.setItem("first_name", first_name);
			return true;
		}
		return false;
	}

	setLastName(last_name: string) {
		if (last_name) {
			localStorage.setItem("last_name", last_name);
			return true;
		}
		return false;
	}

	setUrl(url: string) {
		if (url) {
			localStorage.setItem("url", url);
			return true;
		}
		return false;
	}

	setDisplayName(display_name: string) {
		if (display_name) {
			localStorage.setItem("display_name", display_name);
			return true;
		}
		return false;
	}

	setNickName(nickname: string) {
		if (nickname) {
			localStorage.setItem("nickname", nickname);
			return true;
		}
		return false;
	}

	setImage(image: string) {
		if (image) {
			localStorage.setItem("image", image);
			return true;
		}
		return false;
	}

	setAvatar(avatar: string) {
		if (avatar) {
			localStorage.setItem("avatar", avatar);
			return true;
		}
		return false;
	}

	setOnline(online: boolean) {
		if (online) {
			localStorage.setItem("online", String(online));
			return true;
		}
		return false;
	}

	setTfa(two_factor_auth: boolean | undefined) {
		if (two_factor_auth === undefined)
			localStorage.setItem("two_factor_auth", "false");
		else
			localStorage.setItem("two_factor_auth", String(two_factor_auth));
	}

	setQrCode(qrCode: string | undefined) {
		if (qrCode !== undefined && qrCode !== null && qrCode !== 'null')
			localStorage.setItem("qrCode", qrCode);
		else
			localStorage.setItem("qrCode", "");

	}

	clear() {
		localStorage.clear();
		this.cookieService.delete('code');
	}
}
