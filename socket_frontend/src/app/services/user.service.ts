import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType, HttpRequest, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import {environment1} from '../../environments/environment.prod';
import {Observable, throwError} from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor( private httpClient:HttpClient) { }
	httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization:''
		})
	}
	addUser(data): Observable<any> {
		return this.httpClient.post<any>(environment1.endPoint + 'addUser', JSON.stringify(data), this.httpOptions)
		.pipe(
			retry(1),
			
			)
	}  

	UserLogin(data): Observable<any> {
		return this.httpClient.post<any>(environment1.endPoint + 'UserLogin', JSON.stringify(data),  this.httpOptions)
		.pipe(
			retry(1),
			
			)
	}  

	UserList(): Observable<any> {
		return this.httpClient.get<any>(environment1.endPoint+"UserList")
		.pipe(
			retry(1),

			)
	}

	findOneUser(id): Observable<any> {
		return this.httpClient.get<any>(environment1.endPoint+"findOneUser/" +id)
		.pipe(
			retry(1),

			)
	}
}
