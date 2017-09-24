import { Component } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';
import {Validators, FormBuilder } from '@angular/forms';
import { Http } from '@angular/http';
import {ChatService} from './chat.service';

declare var AudioContext: any;
declare var Webcast: any;
declare var navigator: any;

@Component({
  selector: 'mystream',
  templateUrl: './my-stream.component.html',
  styles: [
    `
      .error {
          color: red;
      }
  `
  ]

})

export class MyStreamComponent {
    context;
    encoder;
    webcast;
    session;
    blurb; 
    blurbForm;

    username;
    messages = [];
    connection;
    message;

    isStreaming=false;

    constructor(
        public http: AuthHttp,
        private fb: FormBuilder,
        private router: Router,
        private chatService: ChatService
    ) {}

    ngOnInit() {
        this.username = localStorage.getItem('username');
        this.blurbForm = this.fb.group({
          blurb: this.fb.control('', Validators.required)
        });
        this.initSession();
    }

    initSession() {
        this.http.post('http://localhost:3000/api/streamsessions', {blurb: 'hello world'})
            .map(res=>res.json())
            .subscribe(res=>{
                this.session = res.session;
                console.log(this.session);
                this.initRTC();
                this.initSocket();
            });  
    }

    initRTC() {
        this.encoder = new Webcast.Encoder.Asynchronous({
            encoder: new Webcast.Encoder.Raw({
                channels: 2,
                samplerate: 44100,
                bitrate: 128
            }),
            scripts: ["https://cdn.rawgit.com/webcast/libsamplerate.js/master/dist/libsamplerate.js", "https://cdn.rawgit.com/savonet/shine/master/js/dist/libshine.js", "https://cdn.rawgit.com/webcast/webcast.js/master/lib/webcast.js"]
        });
    }

    initSocket() {
        this.connection = this.chatService.getMessages(this.username).subscribe(data => {
            if(data['username'] == this.username) {
                this.messages.push('me: ' + data['message']);
            }  else {
                this.messages.push(data['username'] + ': ' + data['message']);
            }
        })
    }
    
    start() {
        var context = this.context = new AudioContext;
        var webcast = this.webcast = this.context.createWebcastSource(4096, 2);
        navigator.getUserMedia({video:false, audio:true}, function(stream) {
            var source = context.createMediaStreamSource(stream);
            source.connect(webcast);
            webcast.connect(context.destination);
        });
        this.webcast.connectSocket(this.encoder, "ws://shangyu:hsu@localhost:"+this.session.ls_port+"/mount");
        this.isStreaming=true;
    }

    stop() {
        this.webcast.close();
        this.isStreaming=false;
    }

    endSession() {
        this.http.delete('http://localhost:3000/api/streamsessions/'+this.session.id)
        .subscribe(()=>{
        });
        return true;
    }

    sendMessage(){
      console.log(this.message);
    this.chatService.sendMessage(this.message, this.username + ' [HOST]');
    this.messages.push('me: ' + this.message);
    this.message = '';
  }

 
    ngOnDestroy() {
        this.connection.unsubscribe();
    }
}

    
