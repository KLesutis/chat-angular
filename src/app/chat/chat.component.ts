import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MessageService} from "../service/message.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Message} from "../models/message";
import {AuthService} from "../service/auth.service";
import {User} from "../models/user";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('chat') private chatContainer: ElementRef;
  public userid: string;
  public message: FormControl;
  public messageForm: FormGroup;

  public newUsername: FormControl;
  public usernameForm: FormGroup;

  public messages: Array<Message>;
  public users: Array<User>;

  public showSpinner: boolean;

  public image: File;

  private onlineUsers: Array<string>;

  constructor(private messageService: MessageService, private builder: FormBuilder, private authService: AuthService) {
    this.messages = new Array<Message>();
    this.users = new Array<User>();
    this.userid = authService.GetUserID();
    this.showSpinner = false;
    this.onlineUsers = new Array<string>();
  }

  ngOnInit() {
    this.UpdateMessages();
    this.GetAllUsernames();
    this.connectionUptime();

    this.message = new FormControl('');
    this.messageForm = this.builder.group({
      message: this.message
    });

    this.newUsername = new FormControl('');
    this.usernameForm = this.builder.group({
      newUsername: this.newUsername
    });


  }

  private UpdateMessages() {
    this.messageService.GetAllMessasges().subscribe(messages => {
      this.messages = messages;
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);

    }, err => {
      this.authService.logout();
      console.log(err);
    })
  }

  private GetAllUsernames() {
    this.authService.GetAllUsernames()
      .subscribe(users => {
        this.users = users;
      }, err => {
        this.authService.logout();
        console.log(err);
      })
  }

  public PostMessage() {
    let message = this.messageForm.controls['message'].value;

    if ((message && message != "\n") || this.image) {
      this.messageService.PostMessage(message, this.image)
        .subscribe(data => {
          this.messageService.newMessage();
        }, err => {
          console.log(err);
        });
      this.image = null;
    }

    this.messageForm.controls['message'].reset();
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  logout() {
    this.authService.logout();
  }

  updateUsername() {
    this.showSpinner = true;
    let username = this.usernameForm.controls['newUsername'].value;

    if (username) {
      this.authService.updateUsername(username)
        .subscribe(result => {
          this.GetAllUsernames();
          this.UpdateMessages();
          this.showSpinner = false;

        }, err => {
          console.log(err);
          this.showSpinner = false;

        })
    } else {
      this.showSpinner = false;

    }


  }

  onFileUpload(files: File[]) {
    if (files.length > 0) {
      this.image = files[0];
    }
  }

  removeImage() {
    this.image = null;
  }

  connectionUptime() {
    let i = 0;

    this.messageService.updateChatBox()
      .subscribe(update => {
        this.UpdateMessages();
      }, err => {
        console.log(err);
      });

    this.authService.getOnlineUsers()
      .subscribe(users => {
        this.onlineUsers = users;
        this.setOnlineUsers();
      }, err => {
        console.log(err);
      });

    setInterval(() => {
      if (i >= 10) {
        i = 0;
        this.authService.sendOnline();
      }
      i++;
    }, 1000);
  }


  private setOnlineUsers() {
    let online: boolean = false;
    for (let i = 0; i < this.users.length; i++) {
      this.users[i].online = false;
      for (let onlineUser of this.onlineUsers) {
        if (onlineUser == this.users[i]._id) {
          online = true;
          break;
        }
      }
      if(online){
        this.users[i].online = true;
      }
      online = false;
    }
  }
}
