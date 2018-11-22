import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/Rx";
import {map} from "rxjs/operators";
import {AuthService} from "./auth.service";
import {Message} from "../models/message";
import {Socket} from "ng-socket-io";
import {until} from "selenium-webdriver";
import elementIsSelected = until.elementIsSelected;

@Injectable()
export class MessageService {
  private HOSTNAME: string;
  private token: string;
  private userID: string;


  constructor(private http: HttpClient, private authService: AuthService, private socket: Socket) {
    this.HOSTNAME = 'http://0.0.0.0:3000';
    this.token = null;
    this.userID = null;

  }

  GetAllMessasges(): Observable<Message[]> {
    let headers = this.setHeaders();

    return this.http.get<Message[]>(this.HOSTNAME + '/api/message/', {headers: headers})
      .pipe(map((res: Message[]) => {
        return res;
      }, err => {
        return err;
      }));
  }

  PostMessage(message: string, image?: File): Observable<any> {
    let headers = this.setHeaders();
    headers = headers.delete('Content-Type');

    const formData: FormData = new FormData();

    if (image)
      formData.append('image', image);
    if (message)
      formData.append('message', message);
    formData.append('user', this.userID);

    return this.http.post<any>(this.HOSTNAME + '/api/message/', formData, {headers: headers})
      .pipe(map((res: any) => {
        return res;
      }, err => {
        return err;
      }));
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
      this.authService.logout();
    }

    return headers;
  }

  newMessage() {
    this.socket.emit('newMessage', true);
  }

  updateChatBox(): Observable<boolean> {


    return new Observable<boolean>(observer => {
      this.socket.on('updateChat', (data: boolean) => observer.next(data));
    });
  }
}
