import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from 'src/_models/user';
import { Observable } from 'rxjs';
import { identifierModuleUrl } from '@angular/compiler';
import { Photo } from 'src/_models/Photo';
import { CloudinaryPhoto } from 'src/_models/cloudinaryPhoto';
import { PaginatedData } from 'src/_models/Pagination';
import { map } from 'rxjs/operators';
import { Userfilter } from 'src/_models/userfilter';
import { Message } from 'src/_models/message';
import { send } from 'process';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.apiUrl + 'users/';
  constructor(private http: HttpClient) {}

  getUsers(
    pageNumber?,
    pageSize?,
    orderBy?,
    userParams?: Userfilter,
    likeParams?: string
  ): Observable<PaginatedData<User[]>> {
    const paginatedData = new PaginatedData<User[]>();
    let params = new HttpParams();
    if (pageNumber != null && pageSize != null) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }
    if (userParams) {
      params = params.append('minAge', userParams.minAge.toString());
      params = params.append('maxAge', userParams.maxAge.toString());
      params = params.append('gender', userParams.gender.toString());
    }
    if (likeParams === 'includelikers') {
      params = params.append('includelikers', 'true');
    }
    if (likeParams === 'includelikees') {
      params = params.append('includelikees', 'true');
    }
    if (orderBy != null) {
      params = params.append('orderBy', orderBy);
    }
    return this.http
      .get<User[]>(this.baseUrl, { observe: 'response', params })
      .pipe(
        map((respose) => {
          paginatedData.result = respose.body;
          if (respose.headers.has('Pagination')) {
            paginatedData.pagination = JSON.parse(
              respose.headers.get('Pagination')
            );
          }
          return paginatedData;
        })
      );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + id);
  }

  editUser(id: number, user: User) {
    return this.http.put(this.baseUrl + id, user);
  }

  addPhoto(userId: number, photo: CloudinaryPhoto) {
    return this.http.post(this.baseUrl + userId + '/photos', photo);
  }

  setMainPhoto(userId: number, photoId: number) {
    return this.http.post(
      this.baseUrl + userId + '/photos/' + photoId + '/setMain',
      []
    );
  }

  deletePhoto(userId: number, photoId: number) {
    return this.http.delete(this.baseUrl + userId + '/photos/' + photoId);
  }

  likeUser(likerId: number, likeeId: number) {
    return this.http.post(this.baseUrl + likerId + '/like/' + likeeId, {});
  }
  UnlikeUser(likerId: number, likeeId: number) {
    return this.http.post(this.baseUrl + likerId + '/unlike/' + likeeId, {});
  }
  getMessage(
    messageParams: string,
    userId,
    pageNumber?,
    pageSize?
  ): Observable<PaginatedData<Message[]>> {
    const paginatedMessages = new PaginatedData<Message[]>();

    let params = new HttpParams();
    if (pageNumber != null && pageSize != null) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }
    if (messageParams) {
      params = params.append('messageContainer', messageParams);
    }
    return this.http
      .get<Message[]>(this.baseUrl + userId + '/message', {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          paginatedMessages.result = response.body;
          if (
            response.headers.has('Pagination') &&
            response.headers.get('Pagination') != null
          ) {
            paginatedMessages.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }
          return paginatedMessages;
        })
      );
  }

  getMessageThread(senderId: number, receiverId: number) {
    return this.http.get<Message[]>(
      this.baseUrl + senderId + '/message/thread/' + receiverId
    );
  }

  sendMessage(senderId: number, recipientId: number, content: string) {
    return this.http.post(this.baseUrl + senderId + '/message', {
      content,
      recipientId,
    });
  }

  deleteMessage(userId: number, messageId: number) {
    return this.http.post(this.baseUrl + userId + '/message/' + messageId, {});
  }

  markasReadMessage(userId: number, messageId: number) {
    console.log('mark as read' + messageId);
    return this.http.post(
      this.baseUrl + userId + '/message/' + messageId + '/read',
      {}
    ).subscribe();
  }
}
