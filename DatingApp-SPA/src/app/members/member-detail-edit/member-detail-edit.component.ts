import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-detail-edit',
  templateUrl: './member-detail-edit.component.html',
  styleUrls: ['./member-detail-edit.component.css'],
})
export class MemberDetailEditComponent implements OnInit {
  user: User;
  @ViewChild('editForm', { static: true }) editForm: NgForm;
  photoUrl: string;
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.user = data.user;
    });
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  editUser() {
    return this.userService
      .editUser(this.authService.decodedToken.nameid, this.user)
      .subscribe(
        (next) => {
          this.alertify.success('Profile edited successfully');
          this.editForm.reset(this.user);
        },
        (error) => {
          this.alertify.error('Cannot edit profile');
        }
      );
  }
  updateMainPhoto(photoUrl: string) {
    this.user.photoUrl = photoUrl;
  }
}
