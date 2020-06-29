import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { ValueComponent } from './value/value.component';
import { LoginComponent } from './Login/Login.component';
import { AuthService } from './_services/auth.service';
import { HomeComponent } from './Home/Home.component';
import { RegisterComponent } from './Register/Register.component';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { NavComponent } from './nav/nav.component';
import { MessageComponent } from './message/message.component';
import { MemberListsComponent } from './member-lists/member-lists.component';
import { MatchesComponent } from './matches/matches.component';
import { RouterModule } from '@angular/router';
import { appRoots } from './router';

@NgModule({
   declarations: [
      AppComponent,
      ValueComponent,
      LoginComponent,
      HomeComponent,
      RegisterComponent,
      NavComponent,
      MessageComponent,
      MemberListsComponent,
      MatchesComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      FormsModule,
      BrowserAnimationsModule,
      BsDropdownModule.forRoot(),
      RouterModule.forRoot(appRoots)
   ],
   providers: [
      AuthService,
      ErrorInterceptorProvider
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
