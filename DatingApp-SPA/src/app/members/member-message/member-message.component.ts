import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { Message } from 'src/_models/message';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-message',
  templateUrl: './member-message.component.html',
  styleUrls: ['./member-message.component.scss'],
})
export class MemberMessageComponent implements OnInit {
  messages: Message[];
  newMessage: { conetent; recipientId } = {
    conetent: '',
    recipientId: 0,
  };
  @Input() reciverId: number;
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.loadMessageThread();
  }

  loadMessageThread() {
    const currentUserId = +this.authService.decodedToken.nameid;
    this.userService
      .getMessageThread(currentUserId, this.reciverId)
      .pipe(
        tap((messages) => {
          console.log(messages);
          for (let i = 0; i < messages.length; i++) {
            console.log('Read ' + i + ' ' + messages[i].isRead);
            console.log(messages[i].recipientId === currentUserId);
            if (
              messages[i].isRead === false &&
              messages[i].recipientId === currentUserId
            ) {
              this.userService.markasReadMessage(currentUserId, messages[i].id);
            }
          }
        })
      )
      .subscribe(
        (result) => {
          this.messages = result;
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }

  sendMessage() {
    this.newMessage.recipientId = this.reciverId;
    this.userService
      .sendMessage(
        this.authService.currentUser.id,
        this.newMessage.recipientId,
        this.newMessage.conetent
      )
      .subscribe(
        (message: Message) => {
          this.messages.push(message);
          this.newMessage.conetent = '';
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }
}
