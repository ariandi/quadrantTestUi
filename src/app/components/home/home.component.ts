import { Component, OnInit } from '@angular/core';
import {UsersService} from "../../services/users/users.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  users: any;

  constructor(private _usrSrv: UsersService) { }

  ngOnInit(): void {
    this.users = this.getAllUsers();
  }

  async getAllUsers() {
    try{
      let response = await this._usrSrv.getUsers().toPromise();
      return response;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

}
