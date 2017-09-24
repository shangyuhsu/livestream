import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';
import { AlertService} from './alert.service';
import { ActivatedRoute } from '@angular/router';
import {ChatService} from './chat.service';

@Component({
  selector: 'listen',
  templateUrl: './listen.component.html',

})


export class ListenComponent {
    username;
    paramsSubscription;
    session;

    messages = [];
    connection;
    message;

  constructor(private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private http: AuthHttp,
    private chatService:ChatService
  ) {}

  ngOnInit() {
    this.username = localStorage.getItem('username');
    this.paramsSubscription=this.activatedRoute.params
    .subscribe(params => {
        this.findStream(params['username']);
    });
  }

  findStream(username) {
    this.http.get('http://localhost:3000/api/streamsessions/username/'+username)
        .map(res=>res.json())
        .subscribe(res => {
            if(!res.error)
                this.session=res;

            this.connection = this.chatService.getMessages(res.username).subscribe(data => {
                this.messages.push(data['username'] + ': ' + data['message']);
            })
        })
  }

  sendMessage(){
    console.log(this.message);
    this.chatService.sendMessage(this.message, this.username);
    this.messages.push('me: ' + this.message);
    this.message = '';
  }

 
  ngOnDestroy() {
    this.connection.unsubscribe();
    this.paramsSubscription.unsubscribe();
  }


  
}
