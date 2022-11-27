/*
  @project Roadmap
  @author xsvond00
*/

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './Events/calendar/calendar.component';
import { DatabaseComponent } from './Events/database/database.component';
import { DetailComponent } from './Events/detail/detail.component';
import { HomePageComponent } from './home-page/home-page.component';
import { Page404Component } from './page404/page404.component';
import { AuthGuard } from './Services/auth.guard';
import { LoginComponent } from './User/login/login.component';
import { ProfileComponent } from './User/profile/profile.component';

const routes: Routes = [
  {path: '', redirectTo:'home', pathMatch:'full'},
  {path: 'home', component:HomePageComponent},
  {path: 'database', component:DatabaseComponent},
  {path: 'login', component:LoginComponent},
  {path: 'NewEvent', component:DetailComponent, canActivate:[AuthGuard]},
  {path: 'event-detail', component:DetailComponent},
  {path: 'calendar', component:CalendarComponent},
  {path: 'profile', component:ProfileComponent, canActivate: [AuthGuard]},
  {path: '**', component: Page404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
