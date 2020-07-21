import { Injectable } from '@angular/core';
import { AuthService } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';

@Injectable({
  providedIn: 'root',
})
export class SocialauthService {
  constructor(private authservice: AuthService) {}
  googlelogin() {
    return this.authservice.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
}
