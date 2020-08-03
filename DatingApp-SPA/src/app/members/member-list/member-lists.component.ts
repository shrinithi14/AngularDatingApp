import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { User } from 'src/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedData } from 'src/_models/Pagination';
import { Userfilter } from 'src/_models/userfilter';

@Component({
  selector: 'app-member-lists',
  templateUrl: './member-lists.component.html',
  styleUrls: ['./member-lists.component.css'],
})
export class MemberListsComponent implements OnInit {
  users: User[];
  currentUser: User = JSON.parse(localStorage.getItem('user'));
  pagination: Pagination;
  userParmas: Userfilter = {
    gender: this.currentUser.gender === 'male' ? 'female' : 'male',
    maxAge: 99,
    minAge: 18,
  };
  genderList = [
    { value: 'male', display: 'Male' },
    { value: 'female', display: 'Female' },
  ];
  orderBy = 'lastActive';
  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
  }

  loadUsers() {
    this.userService
      .getUsers(
        this.pagination.currentPage,
        this.pagination.pageSize,
        this.orderBy,
        this.userParmas
      )
      .subscribe(
        (result: PaginatedData<User[]>) => {
          this.users = result.result;
          this.pagination = result.pagination;
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  resetFilter() {
    this.userParmas.gender = this.currentUser.gender === 'male' ? 'female' : 'male';
    this.userParmas.minAge = 18;
    this.userParmas.maxAge = 99;
    this.loadUsers();
  }
}
