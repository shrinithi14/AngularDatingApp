import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { ThrowStmt } from '@angular/compiler';
import { JwtHelperService } from '@auth0/angular-jwt';

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
  }
}
