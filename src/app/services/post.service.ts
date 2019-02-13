import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPost, IPosts } from '../models/Interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  // server url for post routes
  public ROOT_URL = 'post';

  constructor(private http: HttpClient) {}

  // post request method for adding a post
  public addPost(info): Observable<IPost> {
    return this.http.post<IPost>(`${this.ROOT_URL}/add`, info);
  }

  // get request method for fetching all posts
  public getPosts(): Observable<IPosts> {
    return this.http.get<IPosts>(`${this.ROOT_URL}/all`);
  }

  // get request method for fetching a single post
  public getSinglePost(id: String): Observable<IPost> {
    return this.http.get<IPost>(`${this.ROOT_URL}/single/${id}`);
  }

  // delete request method for deleting a single post
  public deletePost(id: String): Observable<IPost> {
    return this.http.delete<IPost>(`${this.ROOT_URL}/delete/${id}`);
  }

  // put request method for updating a single post
  public updatePost(info: Object, id: String): Observable<IPost> {
    return this.http.put<IPost>(`${this.ROOT_URL}/update/${id}`, info);
  }
}
