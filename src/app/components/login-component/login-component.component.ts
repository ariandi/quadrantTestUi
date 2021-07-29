import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.scss']
})
export class LoginComponentComponent implements OnInit {

  credentials: FormGroup | any;

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService,) { }

  ngOnInit(): void {
    this.credentials = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  async login() {
    this.authService.login(this.credentials.value).subscribe(
      async (res) => {
        let response = await res.toPromise();
        if (response.token) {
          await this.router.navigateByUrl('/home', {replaceUrl: true});
        } else {
          alert(response.resultMsg);
        }
      },
      async (res) => {
        console.log('error', res);
        alert(res.message || 'login error');
      }
    );
  }


  // Easy access for form fields
  get username() {
    return this.credentials.get('username');
  }

  get password() {
    return this.credentials.get('password');
  }


}
