import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/_models/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  photoUrl: string;
  constructor(public authservice: AuthService, private routerService: Router) {}

  ngOnInit() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    this.authservice.currentPhotoUrl.subscribe(
      (photoUrl) => (this.photoUrl = photoUrl)
    );
    console.log(this.photoUrl);
  }
  logOut() {
    this.authservice.logOut();
    this.routerService.navigate(['/home']);
  }
}
