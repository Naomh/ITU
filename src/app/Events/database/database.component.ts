/*
  @project Roadmap
  @author xhencl02
*/

import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { filter } from '../../Interfaces/Filter';
import {event, tagba, EventLength, EventSchool, EventTopics, EventTypes} from '../../Interfaces/Event';
import { EventService } from 'src/app/Services/event.service';
import { SnackbarService } from 'src/app/Services/snackbar.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DetailComponent } from '../detail/detail.component';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';;


export interface Chip {
  name: string;
}

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.less'],
})
export class DatabaseComponent implements OnInit {
  public EventTopics = EventTopics;
  public EventTypes = EventTypes;
  public EventLength = EventLength;
  public EventSchool = EventSchool;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  chipCtrl = new FormControl();
  filteredChips: Observable<any[]>;
  isShown1: boolean = false;
  isShown2: boolean = false;
  isShown3: boolean = false;
  isShown4: boolean = false;
  chips: any[] = [];

  allChips: any[] = this.EventTopics.concat(this.EventTypes, this.EventLength, this.EventSchool)

  public Events: event[] = [];
  constructor(private Router: Router,private eventService: EventService,  private dialog: MatDialog, private snackbar: SnackbarService, private authService: AuthService) {
    this.filteredChips = this.chipCtrl.valueChanges.pipe(
      startWith(null),
      map((chip: string | null) =>
        chip ? this._filter(chip) : this.allChips.slice()
      )
    );
  }
 public isLogged(){
   return this.authService.isLogged();
 }
  ngOnInit(): void {
    this.eventService.GetEvents({})
      .then(res => { this.Events = (<any>res).results })
      .catch(err => {
        this.snackbar.open('Zdá se, že tu momentálně nic není... divné :(');
        let event:event = <event>{
          starred:true,
          event_id: 1,
          img_path: "../assets/cat.jpg",
          name: "lorem",
          description: "lorem ipsum dolor",
          type: "hackaton",
          targetg_tag_ba: 2,
          tg: "blah",
          rating: 5,
          org_name: "Pepe",
          location: "praha",
          topic_tag_ba: 2,
          price: "$10000",
          counter: 1000,
          owner_u_id:31,
          links:<any>[],
          reviews:<any>[],
          terms:<any>[]
        }
        this.Events.push(event)
      });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our chip
    if (value) {
      this.chips.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.chipCtrl.setValue(null);
  }

  remove(chip: any): void {
    const index = this.chips.indexOf(chip);

    if (index >= 0) {
      this.chips.splice(index, 1);
    }
    (<any>this.search)[chip.type] -= chip.value;
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

  selected(event: MatAutocompleteSelectedEvent): void {
    this.chips.push(event.option.viewValue);
    //this.chipInput.nativeElement.value = '';
    this.chipCtrl.setValue(null);
  }

  /*
type (Seminář, Tábor...)
len (1 - jednodenni, 2 - short term, 4 - long term)
topic (Math...)
tg    target group (1 - ZŠ, 2 - SŠ, 4 - VŠ)

jsou všechno bitarrays jako integer (viz linux práva 0777)
q je querry string na matchování obsahu/názvů
s je sort mechanika
0 - most popular
1 - best ranking
2 - newest
3 - cheapest
4 - upcoming
*/
  public setViewed(id: number){

    const ev = this.Events.find((e) => e.event_id == id);
    if (ev) {
      ev.counter +=1;
    }
    this.authService.setViewedEvent(id);
    const size = innerWidth < 700? {minHeight:'100vh', maxHeight:'100vh', minWidth: '100vw', overflow: 'auto', margin: '0', padding:'0' }: { minHeight: "90vh",maxHeight: "90vh",minWidth:"70vw"}
    const dialogRef = this.dialog.open(DetailComponent,size);
          dialogRef.afterClosed().subscribe(()=>{})

  }
  public search: filter = {
    type: 0,
    len: 0,
    topic: 0,
    tg: 0,
    q: '',
    s: 0
  }
  addToSearch(key: string, value: number, type: string) {
    if (!this.chips.find(chip => key === chip))
      this.chips.push({key: key, value: value, type:type});
    (<any>this.search)[type] += value;
  }

  private _filter(value: string): string[] {
    const filterValue: string = value;

    return this.allChips.filter((chip) =>
      chip.name.toLowerCase().includes(filterValue.toLowerCase())
    );
  }

  toggleShow1() {
    this.isShown1 = !this.isShown1;
    this.isShown2 = false;
    this.isShown3 = false;
    this.isShown4 = false;
  }
  toggleShow2() {
    this.isShown2 = !this.isShown2;
    this.isShown1 = false;
    this.isShown3 = false;
    this.isShown4 = false;
  }
  toggleShow3() {
    this.isShown3 = !this.isShown3;
    this.isShown2 = false;
    this.isShown1 = false;
    this.isShown4 = false;
  }
  toggleShow4() {
    this.isShown4 = !this.isShown4;
    this.isShown2 = false;
    this.isShown3 = false;
    this.isShown1 = false;
  }
  searchEvents() {
    this.eventService.GetEvents(this.search)
    .then(res => this.Events = (<any>res).results)
    .catch(err => this.snackbar.open('Promiň, takovou akci tady ještě nikdo nemá :('));
  }
  getImage(path:string){
    return `../../..${path}`
  }
  changeSort(e:any){
    this.search.s = e.value;
    this.searchEvents();
  }
  public openDialog(): void {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(DetailComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res==='true') {

      }
    });
  }
  toNewEvent(){
    if(!this.authService.isLogged()){
      this.snackbar.open('Pro pokračování se prosím přihlaš');
      this.Router.navigate(['login']);
    }else{
      this.authService.setViewedEvent(-1);
      this.Router.navigate(['NewEvent']);
    }
  }
  public star(id:number){
   this.authService.star(id).toPromise()
   .then(res => {
     this.authService.addFav(id);
     this.snackbar.open('Oblíbil sis akci')})
  .catch(err => {console.log(err); this.snackbar.open('zase to NEFUNGUJE! (╯°□°）╯︵ ┻━┻')})
  }
  public unstar(id:number){
    this.authService.unstar(id).toPromise()
    .then(res =>{console.log(res); this.authService.remFav(id); this.snackbar.open('Znelíbil sis akci')})
    .catch(err =>{console.log(err); this.snackbar.open('zase to NEFUNGUJE! (╯°□°）╯︵ ┻━┻')})
  }
  public isFav(id:number):boolean{
   return this.authService.isFav(id);
  }
}
