/*
  @project Roadmap
  @author xhencl0
*/

import { F } from '@angular/cdk/keycodes';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { frontpage } from '../Interfaces/Event';
import { filter } from '../Interfaces/Filter';
import { SnackbarService } from './snackbar.service';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class EventService {
  private api='http://eva.fit.vutbr.cz:3333/api/';
  private headers: HttpHeaders = this.userService.getHeader();
  constructor(private http:HttpClient, private snackbar: SnackbarService, private userService:AuthService) { }


  public async GetEvents(filter:filter){
    let result = undefined;
    let query = '';
    Object.keys(filter).forEach(key =>
      {
      if((<any>filter)[key]){
      query +=`&${key}=${(<any>filter)[key]}`
    }
    });
    query = query.slice(1);
    return await this.http.get(`${this.api}search?${query}`).toPromise()
  }

  public GetFrontPage(){
    return this.http.get<frontpage>(this.api + 'frontpage').toPromise();
  }
  public getDetail(event_id: number){
    return this.http.get(this.api+`event?event_id=${event_id}`, {headers: this.headers}).toPromise();
  }
  public getCalendar(){
    return this.http.get(this.api+`calendar`).toPromise();
  }
  public deleteEvent(event_id: number){
    return this.http.delete(this.api+`deleteEvent`,{body: {event_id: event_id}}).toPromise();
  }
  public addComment(event_id: number, comment: string, is_public: boolean, rating: number){
    return this.http.post(this.api+`comment`, {event_id: event_id, text: comment, is_public: is_public, rating: rating}, {headers: this.headers}).toPromise()
  }
  public deleteComment(event_id: number){
    return this.http.delete(this.api+`comment`, {headers: this.headers, body: {event_id: event_id}} ).toPromise()
  }
}
