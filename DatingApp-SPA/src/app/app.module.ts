import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { FileUploadModule } from 'ng2-file-upload';
import { Cloudinary } from '@cloudinary/angular-5.x';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
} from 'angularx-social-login';

import { AppComponent } from './app.component';
import { ValueComponent } from './value/value.component';
import { LoginComponent } from './Login/Login.component';
import { AuthService } from './_services/auth.service';
import { HomeComponent } from './Home/Home.component';
import { RegisterComponent } from './Register/Register.component';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { NavComponent } from './nav/nav.component';
import { MessageComponent } from './message/message.component';
import { MemberListsComponent } from './members/member-list/member-lists.component';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailEditComponent } from './members/member-detail-edit/member-detail-edit.component';
import { MemberPhotoComponent } from './members/member-photo/member-photo.component';
import { MatchesComponent } from './matches/matches.component';
import { RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { appRoots } from './router';
import { JwtModule } from '@auth0/angular-jwt';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberDetailEditResolver } from './_resolvers/member-detail-edit.resolver';

const socialconfig = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(
      '643069709185-e4eqk28nfgn0903u7gq6gcrf6o19fus2.apps.googleusercontent.com'
    ),
  },
]);

export function provideConfig() {
  return socialconfig;
}

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
    MatchesComponent,
    MemberCardComponent,
    MemberDetailComponent,
    MemberDetailEditComponent,
    MemberPhotoComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxGalleryModule,
    BsDropdownModule.forRoot(),
    RouterModule.forRoot(appRoots),
    TabsModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
        whitelistedDomains: ['localhost:5000'],
        blacklistedRoutes: ['localhost:5000/api/auth'],
      },
    }),
    FileUploadModule,
    SocialLoginModule,
  ],
  providers: [
    AuthService,
    ErrorInterceptorProvider,
    MemberDetailResolver,
    MemberListResolver,
    MemberDetailEditResolver,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
