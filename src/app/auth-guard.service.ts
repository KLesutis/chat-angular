import { Injectable } from '@angular/core';
import {AuthService} from "./service/auth.service";
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";

@Injectable()
export class AuthGuard  implements CanActivate {

  constructor( private authService : AuthService ) {
  }

  canActivate( route : ActivatedRouteSnapshot, state : RouterStateSnapshot ) {
    if(this.authService.checkToken()){
      return true;
    }else{
      this.authService.logout();
    }
  }
}
