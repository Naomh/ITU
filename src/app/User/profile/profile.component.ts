/*
  @project Roadmap
  @author xsvond00
*/

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmationComponent } from 'src/app/Dialogs/confirmation/confirmation.component';
import { ProfileInfo, RegisterFormUser, UserDetails } from 'src/app/Interfaces/User';
import { AuthService } from 'src/app/Services/auth.service';
import { SnackbarService } from 'src/app/Services/snackbar.service';
import { UserProfileService } from 'src/app/Services/user-profile.service';
import {event, tagba, EventLength, EventSchool, EventTopics, EventTypes} from '../../Interfaces/Event';
import * as CryptoJS from 'crypto-js';
import { DetailComponent } from 'src/app/Events/detail/detail.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {
  private newRole = NaN;
  private newProfilePic: FormData  | undefined = undefined;
  private oldProfilePic: string | undefined = undefined;
  public disabled = true;
  public roleEdit = false;
  public loginForm = this.formBuilder.group({
    username: ['', Validators.minLength(3)],
    password: [''],
    passwordConfirm: [''],
    firstname: ['', Validators.minLength(3)],
    lastname: ['', Validators.minLength(3)],
    email: ['', Validators.email],
    brief: ['']
  }, {validator: this.passwordMatchValidator})
  public user: UserDetails={};
  public favorites: event[] = [];
  constructor(
    private userService: AuthService,
    private profileService: UserProfileService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private Router: Router,
    private snackBar: SnackbarService) {
      this.userService.checkToken();
      profileService.getFavs().then(res => this.favorites = (<any>res).results).catch(err => snackBar.open('Něco je špatně ¯\_(ツ)_/¯'))
      const u_id = this.userService.getViewedProfile();
      this.profileService.getUserProfile(u_id).then(res =>{if(res)this.user = res})
    }
  public getRole_id():number{
  return this.userService.getRoleId()
  }
  public getProfile_photo_name():string{
if (this.newProfilePic && this.user.img_path){
  return this.user.img_path;
}
return `../../${this.user.img_path ?? 'assets/AppImages/profileImage.png'}`
  }
  public getUname():string{
return '';
  }
  private newsrc = '';
  onFileSelected(e:any) {
  const inputNode = document.querySelector('#file') as HTMLInputElement;
    this.newProfilePic = new FormData();
    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0])
      reader.onload = (event: any) => {
      this.newsrc= `assets/AppImages/${e.target.files[0].name}`;
      console.log(this.newsrc);
      this.oldProfilePic = this.user?.img_path ?? '../../../assets/AppImages/profileImage.png';
      this.user.img_path = event.target.result;
      this.newProfilePic?.append('image',e.target.files[0]);
      };
    }
  }
  private passwordMatchValidator(g: FormGroup) {
    return g.controls['password'].value === g.controls['passwordConfirm'].value
       ? null : {'mismatch': true};
 }
  public cancel() {

    this.loginForm.disable();
    if(this.newProfilePic){
    this.user.img_path = this.oldProfilePic;
  }
    Object.keys(this.loginForm.value).forEach( key =>
      this.loginForm.patchValue({[key] : (<any>this.user)[key]})
      )
    this.disabled = true;
    this.roleEdit = false;
  }

  public updateRid(role: number) {
    this.newRole = role;
  }
  public getRole() {
    return this.userService.hasRole();
  }
  public CanEdit(): boolean {
    return ((this.userService.getRoleId() === 2 && this.user.role_id != 2) || this.user.u_id === this.userService.getUid()) ? true : false;
  }
  public CanLogout(): boolean {

   return this.user.u_id === this.userService.getUid() ? true : false;
  }
  public openDialog(): void {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((res:any) => {
      if (res==='true') {
        this.deleteAccount();
      }
    });
  }
  public editInfo(): void {
    if (this.user.u_id === this.userService.getUid()) {
      this.loginForm.enable();
    }
    if (this.userService.getRoleId() == 2) {
      this.roleEdit = true;
    }
    this.disabled = false;
  }
  public logOut(): void {
    this.userService.logOut();

  }
  public deleteAccount(): void {
    if (this.user.u_id) {
      this.profileService.deleteProfile(this.user.u_id).then(() => {
        this.snackBar.open('Tak tedy sbohem :(')
        this.logOut();
      })
       .catch(() => this.snackBar.open('Promiň, teď to prostě nejde ¯\_(ツ)_/¯'));
    } else { this.snackBar.open('(╯°□°）╯︵ ┻━┻ Nesnaž se mě rozbít!')}

  }

  public updateProfile(): void {
    if(this.loginForm.valid){
    const values = this.loginForm.value;
    const updates:ProfileInfo = this.user;
    Object.keys(values).forEach(key =>{
      if(key !== 'password' && key !== 'passwordConfirm')
      {
        if(values[key]){
        (<any>updates)[key] = values[key];
        }

      }else if(key === 'password'){
        updates.passhash = CryptoJS.HmacSHA256(values.password,'J92UF').toString();
      }

    })
    if(this.newsrc){
    updates.img_path = this.newsrc;
  }
    this.profileService.update(updates)
    .then(() => {
      this.loginForm.disable();
      this.snackBar.open('Profil aktualizován!');
      Object.keys(updates).forEach( key =>{
          this.disabled = true;
          this.user=updates}
        )
    })
    .catch((err) => {this.snackBar.open('Promiň, nějak to prostě nejde ¯\_(ツ)_/¯'); console.log(err)});
   /* if(this.newProfilePic){
      this.profileService.uploadProfile(this.newProfilePic)
      .catch(() => this.snackBar.open('Nahrávání obrázku se nezdařilo :('))
    }*/

    }else{
      this.snackBar.open('Formulář nebyl vyplněn správně');
    }
  }

  ngOnInit(): void {
    this.loginForm.disable()
  }
flip(e:any){
e.target.classList.toggle('flipped');
}
getpath(name: string){
return `../../../${name}`
}
public setViewed(id: number){

  const ev = this.favorites.find((e) => e.event_id === id);
  if (ev) {
    ev.counter +=1;
  }
  this.userService.setViewedEvent(id);
  const dialogRef = this.dialog.open(DetailComponent, {
    minHeight: "90vh",
    maxHeight: "90vh",
    minWidth:"370"

  });
        dialogRef.afterClosed().subscribe(()=>{})

}
getImage(path:string){
  return `../../..${path}`
}
public decodeTypeTagBa(tag_ba:number):any{
  var res = "";
  EventSchool.forEach(school => {
    if (tag_ba & school.id) {
      if (res != "") res += ", ";
      res += school.name
    }
  });
  return res;
}
public decodeDuration(duration: number):any{
  const res = EventLength.find(event => event.id === duration);
  return res?.name;
}
public decodeTopicTagBa(tag_ba: number):any{
  var res = "";
  EventTopics.forEach(topic => {
    if (tag_ba & topic.id) {
      if (res != "") res += ", ";
      res += topic.name
    }
  });
  if (res.length > 80)
    return res.substr(0, 80) + "...";
  else
    return res;
}

public unstar(id:number){
  this.userService.unstar(id).toPromise()
  .then(res =>{
    console.log(res);
    const index = this.favorites.map(e => e.event_id).indexOf(id);
    this.favorites.splice(index,1);
    this.userService.remFav(id); this.snackBar.open('Znelíbil sis akci')})
  .catch(err =>{console.log(err); this.snackBar.open('zase to NEFUNGUJE! (╯°□°）╯︵ ┻━┻')})
}
}
