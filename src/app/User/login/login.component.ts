/*
  @project Roadmap
  @author xsvond00
*/

import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { AuthService } from 'src/app/Services/auth.service';
import { SnackbarService } from 'src/app/Services/snackbar.service';
import { LoginFormUser, RegisterFormUser } from 'src/app/Interfaces/User';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
   public active = false;
   public LoginForm = this.formBuilder.group({
    userName:['', Validators.required],
    password:['', Validators.required],
  })
   public RegisterForm = this.formBuilder.group({
     userName:['', Validators.compose([Validators.required, Validators.minLength(3)])],
     password:['', Validators.compose([Validators.required])],
     passwordConfirm:['', Validators.compose([Validators.required])],
     email: ['', Validators.compose([Validators.email, Validators.required])]
   }, {validator: this.passwordMatchValidator})

  constructor(private formBuilder: FormBuilder, private snackbar: SnackbarService, private auth: AuthService) { }

  ngOnInit(): void {
  }
  private passwordMatchValidator(g: FormGroup) {
    return g.controls['password'].value === g.controls['passwordConfirm'].value
       ? null : {'mismatch': true};
 }
 public logIn():void{
   if(this.LoginForm.valid){
  const user: LoginFormUser = {
    username: this.LoginForm.value.userName,
    passhash: CryptoJS.HmacSHA256(this.LoginForm.value.password,'J92UF').toString()
  };
  this.auth.logIn(user)
  .catch(err => this.snackbar.open('Přihlášení nebylo úspěšné. Byly zadány neplatné přihlašovací údaje'));
}else{this.snackbar.open('Přihlašovací formulář není správně vyplněn')}
  return;
 }

public register():void{
  if(this.RegisterForm.valid){
    const values = this.RegisterForm.value;
    const user: RegisterFormUser = {
      username: values.userName,
      passhash: CryptoJS.HmacSHA256(values.password,'J92UF').toString(),
      email: values.email,
      firstname: '',
      lastname: ''
    }
    this.auth.register(user)
    .then(() => this.snackbar.open('Registrace úspěšná'))
    .catch(() => this.snackbar.open('Registrace nebyla úspěšná'))

  }else{
    this.snackbar.open('Registrační formulář není správně vyplněn')
  }
}
}
