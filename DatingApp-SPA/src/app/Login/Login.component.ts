import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { tokenName } from '@angular/compiler';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.css'],
})
export class LoginComponent implements OnInit {
  model: any = {};
  @Output() registerMode = new EventEmitter();
  constructor(
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private routerService: Router
  ) {}

  ngOnInit() {
  }

  login() {
    this.authService.login(this.model).subscribe(
      (next) => {
        this.alertifyService.success('Login succesful');
      },
      (error) => {
        this.alertifyService.error(error);
      },
      () => {
        this.routerService.navigate(['/members']);
      }
    );
  }
  loggedIn() {
    return !!localStorage.getItem('token');
  }
  setregisterMode() {
    this.registerMode.emit(true);
  }
}
