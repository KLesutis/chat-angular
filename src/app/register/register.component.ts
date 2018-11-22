import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../service/auth.service";
import {Router} from "@angular/router";

function passwordConfirming(c: AbstractControl): any {
  if (!c.parent || !c) return;
  const pwd = c.parent.get('password');
  const cpwd = c.parent.get('cpassword')

  if (!pwd || !cpwd) return;
  if (pwd.value !== cpwd.value) {
    return {invalid: true};

  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public username: FormControl;
  public password: FormControl;
  public cpassword: FormControl;

  public registerForm: FormGroup;
  public registerError: boolean;

  constructor(private authService: AuthService, private builder: FormBuilder, private router: Router) {
this.registerError = false;
  }

  ngOnInit() {
    this.username = new FormControl('', [Validators.required,Validators.minLength(4)]);
    this.password = new FormControl('', [Validators.required,Validators.minLength(6)]);
    this.cpassword = new FormControl('', [Validators.required, passwordConfirming]);

    this.registerForm = this.builder.group({
      username: this.username,
      password: this.password,
      cpassword: this.cpassword
    });
  }

  public register(){

    let user = this.registerForm.controls['username'].value;
    let pass = this.registerForm.controls['cpassword'].value;

    if(this.registerForm.controls['username'].errors){
      this.registerError = true;
    }
    if(this.registerForm.controls['cpassword'].errors){
      this.registerError = true;
    }

    setTimeout(()=>{
      this.registerError = false;
    }, 3000);

    if(!this.registerError)
    this.authService.register(user, pass)
      .subscribe(d =>{
        console.log(d)
        this.router.navigate(['/']);
      },err =>{
        console.log(err);
        this.registerError = true;
      });
  }

}
