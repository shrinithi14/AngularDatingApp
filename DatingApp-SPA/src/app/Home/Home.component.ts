import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css']
})
export class HomeComponent implements OnInit {

  registerMode = false;
  constructor(public authservice: AuthService) { }

  ngOnInit() {
  }
  toggleRegisterMode(mode: boolean){
    this.registerMode = mode;
  }

}
