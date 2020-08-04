import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { User } from 'src/_models/user';
import { Pagination, PaginatedData } from 'src/_models/Pagination';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {

  users: User[];
  currentUser: User = JSON.parse(localStorage.getItem('user'));
  pagination: Pagination;
  likeParams = 'includelikers';
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
    console.log(this.users);
  }

  loadUsers() {
    console.log(this.likeParams);
    this.userService
      .getUsers(
        this.pagination.currentPage,
        this.pagination.pageSize,
        null,
        null,
        this.likeParams
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

}
