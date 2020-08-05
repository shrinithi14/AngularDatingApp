import { Component, OnInit, Input, Output } from '@angular/core';
import { FileUploader, FileUploaderOptions, FileItem } from 'ng2-file-upload';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { Photo } from 'src/_models/Photo';
import { CloudinaryPhoto } from 'src/_models/cloudinaryPhoto';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-member-photo',
  templateUrl: './member-photo.component.html',
  styleUrls: ['./member-photo.component.css'],
})
export class MemberPhotoComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() mainPhoto = new EventEmitter();
  uploader: FileUploader;
  response: any;
  hasBaseDropZoneOver: any;
  currentMain: Photo;

  constructor(
    private userservice: UserService,
    private authservice: AuthService,
    private alertify: AlertifyService
  ) {}
  ngOnInit(): void {
    this.initializeUploader();
  }

  initializeUploader() {
    const uploaderOptions: FileUploaderOptions = {
      url:
        'https://api.cloudinary.com/v1_1/db9yxk8c7/image/upload?upload_preset=wrsnhxrf',
      isHTML5: true,
      autoUpload: false,
      removeAfterUpload: true,
    };
    this.uploader = new FileUploader(uploaderOptions);
    this.uploader.onAfterAddingFile = (fileItem: FileItem): any => {
      fileItem.withCredentials = false;
    };
    this.uploader.onSuccessItem = (
      fileItem,
      response,
      status,
      headers
    ): any => {
      const resp: any = JSON.parse(response);
      const photo: CloudinaryPhoto = {
        publicId: resp.public_id,
        url: resp.url,
      };
      this.userservice
        .addPhoto(this.authservice.decodedToken.nameid, photo)
        .subscribe(
          (uploadresponse: Photo) => {
            this.photos.push(uploadresponse);
            this.alertify.success('Photo added successfully');
          },
          (error) => {
            this.alertify.success('Cannot add Photo');
          }
        );
    };
  }
  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  setMain(photo: Photo) {
    this.userservice
      .setMainPhoto(this.authservice.decodedToken.nameid, photo.id)
      .subscribe(
        (next) => {
          this.alertify.success('Profile Picture Updated');
          this.currentMain = this.photos.filter((p) => p.isMain === true)[0];
          this.currentMain.isMain = false;
          photo.isMain = true;
          this.mainPhoto.emit(photo.url);
          this.authservice.changeUserPhoto(photo.url);
          this.authservice.currentUser.photoUrl = photo.url;
          localStorage.setItem(
            'user',
            JSON.stringify(this.authservice.currentUser)
          );
        },
        (error) => {
          this.alertify.error('Cannot update Profile picture');
        }
      );
  }
  deletePhoto(id: number) {
    this.alertify.confirm('Are you sure you want to delete', () => {
      this.userservice
        .deletePhoto(this.authservice.decodedToken.nameid, id)
        .subscribe(
          (next) => {
            this.photos.splice(
              this.photos.findIndex((p) => p.id === id),
              1
            );
            this.alertify.success('Photo deleted sucessfully');
          },
          (error) => {
            this.alertify.error(error);
          }
        );
    });
  }
}
