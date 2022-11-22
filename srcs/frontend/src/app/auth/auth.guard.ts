import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, take } from 'rxjs';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Injectable({
	providedIn: 'root'
})

export class AuthGuard implements CanActivate {

	locked: boolean = true;
	
	constructor(private auth: AuthService,
		private router: Router,
		private apiService: ApiService) { }

	async unocked() {
		this.locked = false;
	} 
	async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		if (this.auth.getLocked() === false)
			return true;
		else if (await this.auth.userIsOnline())
			return true;
		this.auth.logout();
		this.router.navigateByUrl('');
		return false
	}
}
