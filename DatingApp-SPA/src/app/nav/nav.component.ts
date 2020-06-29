import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(public authservice: AuthService, private routerService: Router) { }

  ngOnInit() {
  }
  logOut(){
    this.authservice.logOut();
    this.routerService.navigate(['/home']);
  }

}
