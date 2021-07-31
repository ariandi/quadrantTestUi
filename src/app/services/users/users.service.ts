import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {catchError, map, switchMap, timeout} from "rxjs/operators";
import {BehaviorSubject, from, Observable, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {LocalStorageService} from "angular-web-storage";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient,
              private localStorage: LocalStorageService) { }

  getUsers(): any {
    const token = this.localStorage.get(environment.TOKEN_KEY);

    const header = {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: '*/*',
        Connection: 'keep-alive',
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type' : 'application/json',
      }
    };

    return this.http.get(environment.apiUrl + 'users', header).pipe(
      timeout(5000),
      map((data: any) => data),
      switchMap(async data => {// console.log(data);
        return from([data]);
      }),
      catchError(this.errorHandler)
    );
  }

  errorHandler(error: HttpErrorResponse) {
    console.log(error);
    return throwError(error);
    // return Observable.throw(error.message || 'server error.');
  }
}
