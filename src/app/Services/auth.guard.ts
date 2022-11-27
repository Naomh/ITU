/*
  @project Roadmap
  @author xsvond00
*/

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, CanLoad, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{
  constructor(private AuthService: AuthService, private router: Router){

    }
  canActivate(){
  const result = async () => {
   await this.AuthService.checkToken();
   const res = await this.AuthService.isLogged();
   console.log('auth' + res);
   return res;
  }
  return result();
    }
  }
