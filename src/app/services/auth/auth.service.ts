import { Injectable } from '@angular/core';
import {BehaviorSubject, from, Observable} from "rxjs";
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

  constructor(private http: HttpClient, private localStorage: LocalStorageService,) {
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

  login({email, password}: any): Observable<any> {
    let credentials = {email, password};
    return this.http.post(environment.apiUrl + 'login', credentials).pipe(
      timeout(5000),
      map((data: any) => data),
      switchMap(async data => {
        // console.log(data);
        await this.setUser(data);
        this.localStorage.set(environment.TOKEN_KEY, data.token);
        return from([data]);
      }),
      tap(_ => {
        // @ts-ignore
        if (_.token){
          this.isAuthenticated.next(true);
        }else{
          this.isAuthenticated.next(false);
        }
      }),
      catchError(this.errorHandler)
    );
  }

  // JSON "set" example
  async setUser(user: string) {
    this.localStorage.set('userData', user);
  }

  logout(): void {
    this.isAuthenticated.next(false);
    return this.localStorage.remove(environment.TOKEN_KEY);
  }

  errorHandler(error: HttpErrorResponse) {
    alert(error.message || 'server error.');
    return Observable.throw(error.message || 'server error.');
  }

}
