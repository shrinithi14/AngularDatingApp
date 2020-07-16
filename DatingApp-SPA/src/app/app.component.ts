import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { ThrowStmt } from '@angular/compiler';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from 'src/_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  jwtService = new JwtHelperService();
  constructor(public authservice: AuthService) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.authservice.decodedToken = this.jwtService.decodeToken(token);
    }
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.authservice.currentUser = user;
      this.authservice.changeUserPhoto(user.photoUrl);
    }
  }
}
