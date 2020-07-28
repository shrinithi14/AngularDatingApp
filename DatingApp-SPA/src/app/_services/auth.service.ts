import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/_models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private baseUrl = environment.apiUrl + 'auth';
  jwtService = new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

  changeUserPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  userExist(username: string) {
    return this.http.get(this.baseUrl + '/userpresent/' + username);
  }

  login(user: any) {
    return this.http.post(this.baseUrl + '/login', user).pipe(
      map((response: any) => {
        const userresponse = response;
        if (user) {
          localStorage.setItem('token', userresponse.token);
          localStorage.setItem('user', JSON.stringify(userresponse.user));
          this.decodedToken = this.jwtService.decodeToken(userresponse.token);
          this.currentUser = userresponse.user;
          this.changeUserPhoto(this.currentUser.photoUrl);
        }
      })
    );
  }

  register(user: User) {
    return this.http.post(this.baseUrl + '/register', user);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtService.isTokenExpired(token);
  }

  logOut() {
    localStorage.clear();
  }
}
