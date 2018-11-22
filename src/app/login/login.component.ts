import {Component, OnInit} from '@angular/core';
import {AuthService} from "../service/auth.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Router, RouterEvent} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: FormControl;
  password: FormControl;

  loginForm: FormGroup;
  loginError: boolean;

  constructor(private authService: AuthService, private builder: FormBuilder, private router: Router) {
    this.loginError = false;
  }

  ngOnInit() {
    this.username = new FormControl('');
    this.password = new FormControl('');

    this.loginForm = this.builder.group({
      username: this.username,
      password: this.password
    });
  }

  public login() {


    let user = this.loginForm.controls['username'].value;
    let pass = this.loginForm.controls['password'].value;

    this.authService.login(user, pass)
      .subscribe(d =>{
        this.router.navigate(['/']);
      }, err =>{
        console.log(err);

        this.loginError = true;

        setTimeout(()=>{
          this.loginError = false;
        }, 3000);

      });

  }

}
