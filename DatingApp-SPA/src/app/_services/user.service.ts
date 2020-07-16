import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from 'src/_models/user';
import { Observable } from 'rxjs';
import { identifierModuleUrl } from '@angular/compiler';
import { Photo } from 'src/_models/Photo';
import { CloudinaryPhoto } from 'src/_models/cloudinaryPhoto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.apiUrl + 'users/';
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + id);
  }

  editUser(id: number, user: User) {
    console.log(user);
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
}
