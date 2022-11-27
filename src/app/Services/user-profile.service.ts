/*
  @project Roadmap
  @author xsvond00
*/

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProfileInfo, RegisterFormUser, UserDetails } from 'src/app/Interfaces/User';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private api='http://eva.fit.vutbr.cz:3333/api/'
  private headers: HttpHeaders = this.userService.getHeader();
  constructor(private http: HttpClient, private userService:AuthService) { }
  public getUserProfile(u_id:number){
  return this.http.get<UserDetails>(this.api + `profile-details?u_id=${u_id}`).toPromise();
}
public deleteProfile(u_id: number){
  return this.http.delete(this.api+'user',{headers: this.headers, body: {u_id: u_id}}).toPromise();
}
public update(updates: ProfileInfo){
  return this.http.post(this.api + 'update-profile', updates, {headers: this.headers}).toPromise();
}
public uploadProfile(picture: any){
  return this.http.post(this.api + 'profile-photo', picture, {headers: this.headers}).toPromise();
}
public getFavs(){
  return this.http.get(this.api + 'favorites', {headers: this.headers}).toPromise();
}

}
