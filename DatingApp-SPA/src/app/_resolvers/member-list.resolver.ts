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

@Injectable()
export class MemberListResolver implements Resolve<User[]> {
  pageSize = 5;
  pageNumber = 1;
  constructor(
    private userservice: UserService,
    private alertify: AlertifyService,
    private router: Router
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
    return this.userservice.getUsers(this.pageNumber, this.pageSize).pipe(
      catchError((error) => {
        this.alertify.error('Problem retriving data' + error);
        this.router.navigate(['home']);
        return of(null);
      })
    );
  }
}
