/*
  @project Roadmap
  @author xkrizv03
*/

import { Component, OnInit } from '@angular/core';
import { frontpage } from '../Interfaces/Event';
import { EventService } from '../Services/event.service';
import { SnackbarService } from '../Services/snackbar.service';
import {event, tagba, EventLength, EventSchool, EventTopics, EventTypes} from '../Interfaces/Event';
import { AuthService } from '../Services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DetailComponent } from '../Events/detail/detail.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.less']
})
export class HomePageComponent implements OnInit {
  public pageInfo:frontpage = {};
  public EventTopics = EventTopics;
  public EventTypes = EventTypes;
  public EventLength = EventLength;
  public EventSchool = EventSchool;
  public Events: event[] = [];
  constructor(private eventService:EventService, private snackbar:SnackbarService, private authService:AuthService, private dialog:MatDialog) {
    this.eventService.GetFrontPage()
    .then((res) => {if(res){this.pageInfo = res}})
    .catch(()=> this.snackbar.open('Nějak to asi nefunguje,... :('));

  }
  public setViewed(id: number){
    this.authService.setViewedEvent(id);
    const dialogRef = this.dialog.open(DetailComponent, {
      minHeight: "90vh",
      maxHeight: "90vh",
      minWidth:"370"

    });
          dialogRef.afterClosed().subscribe(()=>{})

  }
  ngOnInit(): void {
    this.eventService.GetFrontPage()
    .then(res => { this.Events = (<any>res).trending })
    .catch(err => this.snackbar.open('Nějak to asi nefunguje,... :('));
  }
  getImage(path:string){
    return `../../..${path}`
  }
  public decodeTypeTagBa(tag_ba:number):any{
    var res = "";
    this.EventSchool.forEach(school => {
      if (tag_ba & school.id) {
        if (res != "") res += ", ";
        res += school.name
      }
    });
    return res;
  }
  public decodeDuration(duration: number):any{
    const res = this.EventLength.find(event => event.id === duration);
    return res?.name;
  }
  public decodeTopicTagBa(tag_ba: number):any{
    var res = "";
    this.EventTopics.forEach(topic => {
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

}
