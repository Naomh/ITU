/*
  @project Roadmap
  @author xhencl02
*/

import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/Services/event.service';
import { Router } from '@angular/router';
import { TermDisplay } from 'src/app/Interfaces/Term';
import {event, tagba, EventLength, EventSchool, EventTopics, EventTypes} from '../../Interfaces/Event';
import { filter } from '../../Interfaces/Filter';
import {MatTableDataSource} from '@angular/material/table';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { DetailComponent } from 'src/app/Events/detail/detail.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from 'src/app/Services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from 'src/app/Services/snackbar.service';


export interface PeriodicElement {
  name: string;
  position: number;
}




@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.less']
})
export class CalendarComponent implements OnInit {

  public terms:TermDisplay[]= [];
  public Events: event[] = [];
  public favorites: event[] = [];

  public eventForm = this.formBuilder.group({
    eventname: [''],
    org: [''],
    desc: [''],
    location: [''],
    url: ['']
  })
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  public search: filter = {
    type: 0,
    len: 0,
    topic: 0,
    tg: 0,
    q: '',
    s: 0
  }

  constructor(private eventService : EventService,    private dialog: MatDialog,   private snackBar: SnackbarService,  private userService: AuthService,   private formBuilder: FormBuilder,    private snackbar: SnackbarService, private Router:Router) {

  }

  ngOnInit(): void {
    this.eventService.GetEvents({})
    .then(res => {
      this.terms = (<any>res).results
      this.terms.map(t => {
        t.start_date = new Date(t.start_date).toLocaleDateString();
        if(t.end_date){
          t.end_date = new Date(t.end_date).toLocaleDateString();
        }
      })
    })
    .catch(err => this.snackbar.open('V kalendáři nejsou žádné nadcházející akce :('));
  }

  searchEvents() {
    this.eventService.GetEvents(this.search)
    .then(res => {
      this.Events = (<any>res).results;

    })
    .catch(err => this.snackbar.open('Promiň, takovou akci tady ještě nikdo nemá :('));
  }


  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];


public getProfile(u_id: number | undefined){}

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
