import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Message} from "../models/message";
import {Router} from "@angular/router";
import { Socket } from 'ng-socket-io';


@Injectable()
export class AuthService {
  private HOSTNAME: string;
  private userID: string ;
  private token: string;


  constructor(private http: HttpClient, private router: Router, private socket: Socket) {
    this.HOSTNAME = 'http://0.0.0.0:3000';
    this.userID = null;
    this.token = null;
  }

  login(username: string, password: string): Observable<any> {

    return this.http.post<any>(this.HOSTNAME + '/api/user/signin', {
      username: username,
      password: password
    }).pipe(map((res: any) => {
      if (res && res.token) {
        localStorage.setItem('currentUser', JSON.stringify({userid: res.userid, token: res.token}));
      }
    }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }


  register(username: string, password: string): Observable<any> {

    return this.http.post<any>(this.HOSTNAME + '/api/user/signup', {
      username: username,
      password: password
    })
      .pipe(map((res: any) => {
        return res;
      }, err => {
        return err;
      }));
  }

  updateUsername(username: string): Observable<any> {
    let headers = this.setHeaders();

    return this.http.put<any>(this.HOSTNAME + '/api/user/updateusername', {
      userid: this.userID,
      username: username
    },{headers: headers})
      .pipe(map((res: any) => {
        return res;
      }, err => {
        return err;
      }));
  }

  GetAllUsernames(): Observable<any[]> {
    let headers = this.setHeaders();

    return this.http.get<any[]>(this.HOSTNAME + '/api/user/getallusernames', {headers: headers})
      .pipe(map((res: any[]) => {
        return res;
      }, err => {
        return err;
      }));
  }

   GetUserID(){
      let token = localStorage.getItem('currentUser');

      if (token) {
        let userid = localStorage.getItem('currentUser');
        userid = JSON.parse(userid)['userid'];
        this.userID = userid;
      }
      return this.userID;
  }


  setHeaders() {
    let token = localStorage.getItem('currentUser');
    let headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8'); // create header object

    if (token) {


      token = JSON.parse(token)['token'];

      let userid = localStorage.getItem('currentUser');
      userid = JSON.parse(userid)['userid'];

      this.token = token;
      this.userID = userid;


      headers = headers.append('Authorization', 'Bearer ' + token); // add a new header, creating a new object
      headers = headers.append('userID', userid); // add a new header, creating a new object
    } else {
      this.logout();
    }

    return headers;
  }

  sendOnline(){
    let user = this.GetUserID();
    this.socket.emit('online', user);
  }

  getOnlineUsers(): Observable<string[]> {
    return new Observable<string[]>(observer => {
      this.socket.on('onlineUsers', (users: string[]) => observer.next(users));
    });
  }
  checkToken(): boolean{
    if(localStorage.getItem('currentUser'))
      return true;
    else
      return false;
  }

}
