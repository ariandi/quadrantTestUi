import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registration-component',
  templateUrl: './registration-component.component.html',
  styleUrls: ['./registration-component.component.scss']
})
export class RegistrationComponentComponent implements OnInit {

  Roles: any = ['Admin', 'Author', 'Reader'];
  constructor() { }

  ngOnInit(): void {
  }

  register() {}

}
