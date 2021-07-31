import { Injectable } from '@angular/core';
import {BehaviorSubject, from, Observable, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import { LocalStorageService } from 'angular-web-storage';
import {catchError, map, switchMap, tap, timeout} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // @ts-ignore
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';

  constructor(private http: HttpClient,
              private localStorage: LocalStorageService,
              ) {
    this.loadToken().then();
  }

  async loadToken() {
    const token = this.localStorage.get(environment.TOKEN_KEY);
    if (token) {
      // console.log('set token: ', token.value);
      this.token = token;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login({username, password}: any): Observable<any> {
    let credentials = {username, password};
    return this.http.post(environment.apiUrl + 'authenticate', credentials).pipe(
      timeout(5000),
      map((data: any) => data),
      switchMap(async data => {
        this.localStorage.set(environment.TOKEN_KEY, data.token);
        // console.log(data);
        if (data.token) {
          this.isAuthenticated.next(true);
        } else {
          this.isAuthenticated.next(false);
        }
        return from([data]);
      }),
      // tap(resAuth => {
      //   if (resAuth.token){
      //     this.isAuthenticated.next(true);
      //   }else{
      //     this.isAuthenticated.next(false);
      //   }
      // }),
      catchError(this.errorHandler)
    );
  }

  // JSON "set" example
  // async setUser(user: string) {
  //   this.localStorage.set('userData', user);
  // }

  logout(): void {
    this.isAuthenticated.next(false);
    return this.localStorage.remove(environment.TOKEN_KEY);
  }

  errorHandler(error: HttpErrorResponse) {
    console.log(error);
    return throwError(error);
    // return Observable.throw(error.message || 'server error.');
  }

}
