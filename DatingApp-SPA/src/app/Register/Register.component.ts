import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import {
  FormGroup,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { User } from 'src/_models/user';
import { UserService } from '../_services/user.service';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-register',
  templateUrl: './Register.component.html',
  styleUrls: ['./Register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  user: User;
  userExist: boolean;
  bsConfig: Partial<BsDatepickerConfig>;
  constructor(
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private fb: FormBuilder
  ) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-red' });
  }

  @Output() registerMode = new EventEmitter();
  ngOnInit() {
    this.createRegisterform();
  }

  createRegisterform() {
    this.registerForm = this.fb.group(
      {
        gender: ['male', Validators.required],
        knownAs: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        username: ['', Validators.required, this.userExistvalidator.bind(this)],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(8),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchvalidator,
        // , updateOn: 'blur'
      }
    );
  }
  passwordMatchvalidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value
      ? null
      : { mismatch: true };
  }

  userExistvalidator(control: AbstractControl) {
    if (control.value != null && control.value !== '') {
      return this.authService
        .userExist(control.value)
        .pipe(
          map((response: boolean) => (response ? { userpresent: true } : null))
        );
    }
  }

  register() {
    this.user = Object.assign({}, this.registerForm.value);
    this.authService.register(this.user).subscribe(
      (next) => {
        this.alertifyService.confirm(
          'Registeration Successful.You will be redirected to login Page',
          () => this.registerMode.emit(false)
        );
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
