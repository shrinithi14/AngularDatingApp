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
    userParams?: Userfilter
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
