/*
  @project Roadmap
  @author everyone - each line is different author (imports)
*/

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './User/login/login.component';
import { ProfileComponent } from './User/profile/profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './Services/auth.service';
import { HomePageComponent } from './home-page/home-page.component';
import { DatabaseComponent } from './Events/database/database.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarService } from './Services/snackbar.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ConfirmationComponent } from './Dialogs/confirmation/confirmation.component';
import { MatDialogModule} from '@angular/material/dialog';
import { DetailComponent } from './Events/detail/detail.component';
import { MatSelectModule } from '@angular/material/select';
import { Page404Component } from './page404/page404.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ConfirmComponent } from './SystemDialog/confirm/confirm.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule} from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { CalendarComponent } from './Events/calendar/calendar.component';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { MatCheckboxModule } from '@angular/material/checkbox';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    HomePageComponent,
    DatabaseComponent,
    ConfirmationComponent,
    DetailComponent,
    Page404Component,
    ConfirmComponent,
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatMenuModule,
    HttpClientModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatChipsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatSelectModule,
    MatDividerModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    FormsModule,
    MatTabsModule,
    MatRadioModule,
    NgxStarRatingModule,
    MatCheckboxModule
  ],
  providers: [HttpClient, AuthService, SnackbarService, MatDatepickerModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
