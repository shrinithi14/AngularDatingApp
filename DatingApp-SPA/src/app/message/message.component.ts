import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { Message } from 'src/_models/message';
import { PaginatedData, Pagination } from 'src/_models/Pagination';
import { AlertifyService } from '../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent implements OnInit {
  messages: Message[];
  messageContainer = 'unread';
  pagination: Pagination;
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.messages = data['message'].result;
      this.pagination = data['message'].pagination;
    });
  }

  loadMessages() {
    this.userService
      .getMessage(this.messageContainer, this.authService.decodedToken.nameid)
      .subscribe(
        (result: PaginatedData<Message[]>) => {
          this.messages = result.result;
          this.pagination = result.pagination;
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }

  deleteMessage(id: number) {
    this.userService
      .deleteMessage(this.authService.currentUser.id, id)
      .subscribe(
        () => {
          this.alertify.success('Message deleted');
          this.messages.splice(
            this.messages.findIndex((m) => m.id === id),
            1
          );
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }
}
