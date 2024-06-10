import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForbidTechnicienGuard implements CanActivate {
 
  isAdmin: boolean

  
  constructor(private navigation: Router){
    this.isAdmin  = !!localStorage.getItem('role')
  }

  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.isAdmin)
      return true
    else{
      this.navigation.navigate(['dashboard/default'])
      return false
    }
  }
  
}
