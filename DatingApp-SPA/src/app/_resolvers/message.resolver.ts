import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { User } from 'src/_models/user';
import { Observable, of } from 'rxjs';
import { UserService } from '../_services/user.service';
import { catchError } from 'rxjs/operators';
import { AlertifyService } from '../_services/alertify.service';
import { Message } from 'src/_models/message';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MessageResolver implements Resolve<Message[]> {
  pageSize = 5;
  pageNumber = 1;
  messageContainer = 'Unread';
  constructor(
    private userservice: UserService,
    private alertify: AlertifyService,
    private authService: AuthService,
    private router: Router
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
    return this.userservice
      .getMessage(
        this.messageContainer,
        this.authService.decodedToken.nameid,
        this.pageNumber,
        this.pageSize
      )
      .pipe(
        catchError((error) => {
          this.alertify.error('Problem retriving data' + error);
          this.router.navigate(['home']);
          return of(null);
        })
      );
  }
}
