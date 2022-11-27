/*
  @project Roadmap
  @author xkrizv03
*/

import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations';
import { frontpage } from './Interfaces/Event';
import { AuthService } from './Services/auth.service';
import { EventService } from './Services/event.service';
import { SnackbarService } from './Services/snackbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  animations: [
    slideInAnimation
  ]
})
export class AppComponent implements OnInit{

  prepareRoute(outlet: RouterOutlet){
    return outlet?.activatedRouteData?.['slideInAnimation'];
  }
  constructor(public User: AuthService, private Router:Router, private eventService:EventService, private snackbar:SnackbarService){

  }

  ngOnInit(){
    this.User.checkToken()
    .then(() => console.log(':)'))
    .catch(() => console.log(':('))
  }
 public toggleMenu(){
  const checkbox = document.querySelector('#checkboxtoggle') as HTMLInputElement;
  checkbox.checked = !checkbox.checked;
 }
  public toUser(){
    this.User.setViewedProfile(this.User.getUid())

    if( window.location.href === 'http://localhost:4200/profile'){
      window.location.reload()
    }else
    {this.Router.navigate(['profile']);}
  }
}
