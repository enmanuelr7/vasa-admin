import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Blog } from '../models/Blog';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  baseUrl = environment.baseUrl;

  httpOptions = {
    headers: new HttpHeaders({
      Authorization:  `Bearer ${localStorage.getItem('token')}`
    })
  };

  constructor(
    private http: HttpClient
    ) { }

  getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.baseUrl + '/blogs/');
  }

  getBlog(id: string): Observable<Blog> {
    return this.http.get<Blog>(this.baseUrl + '/blogs/' + id);
  }

  deleteBlog(id: number): Observable<any> {
    return this.http.delete<Blog>(this.baseUrl + '/blogs/' + id, this.httpOptions);
  }

}