import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "../services/auth/auth.service";
import {filter, map, take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthLoginGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) { }

  canLoad(): Observable<boolean> {
    return this.authService.isAuthenticated.pipe(
      filter(val => val != null),
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          console.log('Found previous token, automatic login');
          this.router.navigateByUrl('/home', { replaceUrl: true }).then();
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
