import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit() {}

  likeUser(userId: number) {
    this.userService
      .likeUser(this.authService.currentUser.id, userId)
      .subscribe(
        (next) => {
          this.alertifyService.success('You have liked the user');
        },
        (error) => {
          this.alertifyService.error(error);
        }
      );
  }
}
