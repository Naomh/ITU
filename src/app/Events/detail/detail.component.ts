/*
  @project Roadmap
  @author xhencl02
*/

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RegisterFormUser, UserDetails } from 'src/app/Interfaces/User';
import { event, getEvent, review, formReview } from 'src/app/Interfaces/Event';
import { AuthService } from 'src/app/Services/auth.service';
import { EventService } from 'src/app/Services/event.service';
import { SnackbarService } from 'src/app/Services/snackbar.service';
import { UserProfileService } from 'src/app/Services/user-profile.service';
import { FormControl } from '@angular/forms';
import { ConfirmationComponent } from 'src/app/Dialogs/confirmation/confirmation.component';
import {
  tagba,
  EventLength,
  EventSchool,
  EventTopics,
  EventTypes,
} from '../../Interfaces/Event';

@Component({
  selector: 'app-profile',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less'],
})
export class DetailComponent implements OnInit {
  is_public: boolean;
  rating: number;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  public commentForm: FormGroup;
  public EventLength = EventLength;
  public EventSchool = EventSchool;
  public EventTopics = EventTopics;
  public EventTypes = EventTypes;
  private newRole = NaN;
  private newProfilePic: FormData | undefined = undefined;
  private oldProfilePic: string | undefined = undefined;
  public disabled = true;
  public roleEdit = false;
  panelOpenState = false;
  public eventForm = this.formBuilder.group({
    eventname: [''],
    org: [''],
    desc: [''],
    location: [''],
    price: ['', Validators.email],
    url: [''],
  });
  public editComment: boolean = false;
  public creatorMode: boolean = false;
  public event_id:number = 6;
  public forceReview: formReview;
  public Event: getEvent = {};
  constructor(
    private fb: FormBuilder,
    private userService: AuthService,
    private eventService: EventService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private Router: Router,
    private snackBar: SnackbarService
  ) {
    //formz
    this.forceReview = {
      content: "",
      value: 0,
      is_public: false
    };
    this.rating = 3;
    this.is_public = false;
    this.commentForm = this.fb.group({
      rating: [3],
      is_public: false,
    })

    this.eventForm.disable();
    this.userService.checkToken();
    const id = userService.getViewedEvent();
    if (id !== -1) {
      this.eventService
        .getDetail(id)
        .then((res) => {
          if (res) this.Event = res;
          this.Event.terms?.forEach((e) => {
            if (e.start_date) {
              e.start_date = new Date(e.start_date).toLocaleDateString();
            }
            if (e.end_date) {
              e.end_date = new Date(e.end_date).toLocaleDateString();
            }
          });
          //reviews
          console.log(res);
          this.forceReview.is_public = this.Event.user?.review?.is_public ? true : false;
        })
        .catch((err) => {
          this.creatorMode = true;
          this.eventForm.enable();
          this.Event.img_path = '../../../assets/img/placeholder.png';
        });


    } else {
      this.creatorMode = true;
      this.eventForm.enable();
      this.Event.img_path = '../../../assets/img/placeholder.png';
    }
  }
  public getRole_id(): number {
    return this.userService.getRoleId();
  }
  public save() {
    this.snackBar.open('tato akce není momentálně dostupná');
  }
  onFileSelected(e: any) {
    const inputNode = document.querySelector('#file') as HTMLInputElement;
    this.newProfilePic = new FormData();
    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.oldProfilePic =
          this.Event?.img_path ?? '../../../assets/AppImages/profileImage.png';
        this.Event.img_path = event.target.result;
        this.newProfilePic?.append('image', e.target.files[0]);
      };
    }
  }

  public update() {
    this.eventService
    .getDetail(this.event_id)
    .then((res) => {
      if (res) this.Event = res;
      this.Event.terms?.forEach((e) => {
        if (e.start_date) {
          e.start_date = new Date(e.start_date).toLocaleDateString();
        }
        if (e.end_date) {
          e.end_date = new Date(e.end_date).toLocaleDateString();
        }
      });
      //reviews
      console.log(res);
      this.forceReview.is_public = this.Event.user?.review?.is_public ? true : false;
    })
    .catch((err) => {
      this.creatorMode = true;
      this.eventForm.enable();
      this.Event.img_path = '../../../assets/img/placeholder.png';
    });
  }

  public cancel() {
    this.eventForm.disable();
    if (this.newProfilePic) {
      this.Event.img_path = this.oldProfilePic;
    }
    Object.keys(this.eventForm.value).forEach((key) =>
      this.eventForm.patchValue({ [key]: (<any>this.Event)[key] })
    );
    this.disabled = true;
    this.roleEdit = false;
  }
  public decodeTypeTagBa(tag_ba: number): any {
    var res = '';
    this.EventSchool.forEach((school) => {
      if (tag_ba & school.id) {
        if (res != '') res += ', ';
        res += school.name;
      }
    });
    return res;
  }
  public decodeDuration(duration: number): any {
    const res = this.EventLength.find((event) => event.id === duration);
    return res?.name;
  }
  public decodeTopicTagBa(tag_ba: number): any {
    var res = '';
    this.EventTopics.forEach((topic) => {
      if (tag_ba & topic.id) {
        if (res != '') res += ', ';
        res += topic.name;
      }
    });
    if (res.length > 80) return res.substr(0, 80) + '...';
    else return res;
  }
  public updateRid(role: number) {
    this.newRole = role;
  }
  public getRole() {
    return this.userService.hasRole();
  }
  public hasOwnReview(){
    if (this.Event.user == null) return false;
    return this.getRole() != 'Visitor' && this.Event.user?.review?.content
  }
  public CanEdit(): boolean {
    return this.userService.getRoleId() === 2 ||
      this.Event.owner_u_id === this.userService.getUid()
      ? true
      : false;
  }
  public openDialog(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res === 'true') {
        this.deleteEvent();
      }
    });
  }
  public editInfo(): void {
    if (this.Event.owner_u_id === this.userService.getUid()) {
      this.eventForm.enable();
    }
    if (this.userService.getRoleId() == 2) {
      this.roleEdit = true;
    }
    this.disabled = false;
  }
  public toggleEdit(): void{
    this.editComment = !this.editComment;

    this.forceReview.content = this.Event.user?.review?.content || "";
  }
  public isEditing(): boolean{
    return this.editComment;
  }
  public logOut(): void {
    this.userService.logOut();
  }
  public createRange(number : number){

    return new Array(number);
  }
  public deleteComment():void {
    if (this.Event.event_id) {
      this.eventService
        .deleteComment(this.Event.event_id)
        .then(() => {
          if (this.Event.user) {
            this.Event.user.review = undefined;
          }
          this.snackBar.open('Recenze smazána!');
        })
        .catch(() =>
          this.snackBar.open('Promiň, teď to prostě nejde ¯\\_(ツ)_/¯')
        );
    }
  }
  public deleteEvent(): void {
    if (this.Event.event_id) {
      this.eventService
        .deleteEvent(this.Event.event_id)
        .then(() => {
          this.snackBar.open('Akce odstraněna!');
          this.logOut();
        })
        .catch(() =>
          this.snackBar.open('Promiň, teď to prostě nejde ¯\\_(ツ)_/¯')
        );
    } else {
      this.snackBar.open('(╯°□°）╯︵ ┻━┻ Nesnaž se mě rozbít!');
    }
  }
  public pushComment(msg: any) {
    this.forceReview.content = msg;
    this.forceReview.is_public = this.commentForm.value.is_public;
    this.forceReview.value = this.commentForm.value.rating;

    if (this.Event.user) {
      if (this.Event.user.review) {
        this.Event.user.review.content = msg;
        this.Event.user.review.value = this.commentForm.value.rating;
        this.Event.user.review.date = Date.now().toString();
        this.Event.user.review.is_public = this.commentForm.value.is_public;
      }
    }
    this.eventService.addComment(this.userService.getViewedEvent() || -1, msg, this.commentForm.value.is_public, this.commentForm.value.rating)
    .then(() => {
      //this.snackBar.open('Komentář přidán!');
      this.update()
    })
    .catch(() =>
      this.snackBar.open('Promiň, teď to prostě nejde ¯\\_(ツ)_/¯')
    );
  }

  public changeVisibility (newVis : boolean){
    this.forceReview.is_public = newVis;
    this.forceReview.value = this.Event.user?.review?.value || 0;
    this.forceReview.content = this.Event.user?.review?.content || '';
    this.eventService.addComment(this.userService.getViewedEvent() || -1, this.forceReview.content, this.forceReview.is_public, this.forceReview.value)
    .then(() => {
      //this.snackBar.open('Změněna viditelnost!');
      this.update()
    })
    .catch(() =>
      this.snackBar.open('Promiň, teď to prostě nejde ¯\\_(ツ)_/¯')
    );;

  }
  ngOnInit(): void {}

}
