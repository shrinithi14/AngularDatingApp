import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './Register.component.html',
  styleUrls: ['./Register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private alertifyService: AlertifyService
  ) {}
  model: any = {};
  @Output() registerMode = new EventEmitter();
  ngOnInit() {}
  register() {
    this.authService.register(this.model).subscribe(
      (next) => {
        this.alertifyService.confirm(
          'Registeration Successful.You will be redirected to login Page',
          () => this.registerMode.emit(false));
      },
      (error) => {
        this.alertifyService.error(error);
      }
    );
  }
  toggleRegisterMode() {
    this.registerMode.emit(false);
  }
}
