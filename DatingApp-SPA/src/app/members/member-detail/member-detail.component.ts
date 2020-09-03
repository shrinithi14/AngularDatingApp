import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/_models/user';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation,
} from 'ngx-gallery-9';
import { AuthService } from 'src/app/_services/auth.service';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryItems: NgxGalleryImage[];
  userLiked = false;
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private alertify: AlertifyService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.user = data['user'];
    });

    this.route.queryParams.subscribe(params => {
      const selectedTab = params['tab'];
      this.memberTabs.tabs[selectedTab > 0 ? selectedTab : 0].active = true;
    });

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imageAnimation: NgxGalleryAnimation.Slide,
        thumbnailsColumns: 4,
        imagePercent: 100,
        preview: false,
      },
    ];
    this.galleryItems = this.getImages();
    this.userAlreadyLiked();
  }

  getImages() {
    const imageUrls = [];
    for (const photo of this.user.photos) {
      imageUrls.push({
        small: photo.url,
        big: photo.url,
        medium: photo.url,
        description: photo.description,
      });
    }
    return imageUrls;
  }
  loadUser() {
    this.userService.getUser(+this.route.snapshot.params['id']).subscribe(
      (user: User) => {
        this.user = user;
      },
      (error) => {
        this.alertify.error(error);
      }
    );
  }

  handleLike() {
    if (this.userLiked) {
      this.UnlikeUser();
    } else {
      this.likeUser();
    }
  }
  likeUser() {
    this.userService
      .likeUser(this.authService.currentUser.id, this.user.id)
      .subscribe(
        (next) => {
          this.alertify.success('You have liked the user');
          this.userLiked = true;
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }

  userAlreadyLiked() {
    this.userService
      .getUsers(null, null, null, null, 'includelikees')
      .subscribe((result) => {
        if (result.result.find((u) => u.id === this.user.id) != null) {
          this.userLiked = true;
        }
      });
  }

  UnlikeUser() {
    this.userService
      .UnlikeUser(this.authService.currentUser.id, this.user.id)
      .subscribe(
        (next) => {
          this.alertify.success('You have unliked the user');
          this.userLiked = false;
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }
}
