import { Component, OnInit } from '@angular/core';
import { User } from 'src/_models/user';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation,
} from 'ngx-gallery-9';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryItems: NgxGalleryImage[];
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.user = data['user'];
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
}
