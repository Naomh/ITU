/*
  @project Roadmap
  @authors xsvond00, xkrizv03
*/

import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import * as User from '../Interfaces/User'
import { getLocaleCurrencyCode } from '@angular/common';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string = '';
  private tokenValidated: boolean = false;
  private headers: HttpHeaders = new HttpHeaders();
  private loggedUser: any;
  private api = 'http://eva.fit.vutbr.cz:3333/api/';


  constructor(private http: HttpClient, private Router: Router) {
    this.headers = this.getHeader();
    const token = localStorage.getItem('token');
    if(token){
      this.assignUserInfo(token);
    }
  }
  public isFav(id:number):boolean{
    return this.loggedUser.favorites.indexOf(id) !== -1 ? true : false;
  }
  private assignUserInfo(token:string){
    const jwtDecoded:any = jwtDecode(token);
   this.loggedUser = {
     role_id: jwtDecoded.role_id,
     username: jwtDecoded.username,
     u_id: jwtDecoded.u_id, viewUsr:
     parseInt(localStorage.getItem('viewUsr')??''),
     viewEvent:localStorage.getItem('viewEvent'),
     favorites: localStorage.getItem('favorites')?.split(',').map(Number)?? []
    }
    console.log(jwtDecoded);
  }

  public async checkToken():Promise<any> {
    const token = this.getToken();
    if(token){
      await this.http.post<string>(this.api+'check', {token: token}).toPromise()
      .then(res => {
        if((<any>res).message==='OK'){
          this.tokenValidated = true;
          localStorage.setItem('token', token);
          this.headers = this.headers.append('x-access-token',token);

        }
      })
      .catch(() => this.tokenValidated = false)
    }

  }
  /* xkrizv03 */
  public getHeader():HttpHeaders{
    return new HttpHeaders({'x-access-token': localStorage.getItem('token') ?? '', 'u_id': localStorage.getItem('u_id') ?? ''});
  }
  public getToken(): string | undefined{
    return localStorage.getItem('token') ?? undefined;
  }
  public getViewedEvent(){
    return this.loggedUser.viewEvent
  }

  /* xsvond00 */
  public setViewedEvent(id:number){
    localStorage.setItem('vievEvent', id.toString());
    if(this.loggedUser)
   {this.loggedUser.viewEvent = id;}
   else{this.loggedUser = {viewEvent: id}}
  }
  public setViewedProfile(id:number):void{
    localStorage.setItem('viewUsr', id.toString());
    this.loggedUser.viewUsr = id;
  }
  public getViewedProfile():number{
    return this.loggedUser.viewUsr;
  }
  public getUid():number{
    return this.loggedUser.u_id;
  }
  public getRoleId(): number{
    return this.loggedUser.role_id;
  }
  public hasRole():string{
    switch (this.loggedUser.role_id){
    case 0: return 'Člen';
    case 1: return 'Moderátor';
    case 2: return 'Admin';
    default: return 'Visitor';
    }
  }
  public logOut():void{
    localStorage.clear();
    this.loggedUser={role_id: NaN, username: '', u_id: NaN, viewUsr:NaN, viewEvent: NaN, favorites:[]};
    this.tokenValidated = false;
    this.Router.navigate(['login'])

  }

  public async logIn(user: User.LoginFormUser){
   return await this.http.post(this.api + 'login', user).toPromise()
   .then(res => {
     this.token = (<any>res).token;
     console.log(res);
     localStorage.setItem('favorites', (<any>res).favorites);
     this.tokenValidated = true;
     localStorage.setItem('token', this.token);
     this.assignUserInfo(this.token);
     this.Router.navigate(['home'])
    })
  }
  public isLogged(): boolean {
    return this.tokenValidated;
  }
  public async register(user:User.RegisterFormUser){
   return await this.http.post(this.api + 'register', user).toPromise()
   .then( res => {
     this.token = (<any>res).token;
     localStorage.setItem('favorites', (<any>res).favorites);
     this.tokenValidated = true;
     localStorage.setItem('token', this.token);
     console.log(this.token);
     this.assignUserInfo(this.token);
     this.Router.navigate(['home'])});
  }
  public star(event_id: number){
    return this.http.post(this.api+'fav', {event_id: event_id}, {headers: this.headers})
  }
  public unstar(event_id: number){
    return this.http.post(this.api+'unfav', {event_id: event_id}, {headers: this.headers})
  }
  public addFav(id: number){
    this.loggedUser.favorites.push(id);
    localStorage.setItem('favorites', this.loggedUser.favorites);
  }
  public remFav(id:number){
   delete this.loggedUser.favorites[this.loggedUser.favorites.indexOf(id)];
   localStorage.setItem('favorites', this.loggedUser.favorites);
  }
}
