import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class ChatService {
  private url = 'http://localhost:3000';  
  private socket;
  
  sendMessage(message, username){
    this.socket.emit('new message', {message: message, username: username});    
  }
  
  getMessages(username) {
    let observable = new Observable(observer => {
      this.socket = io(this.url+'/'+username);
      this.socket.on('new message', (data) => {
            observer.next({ username: data.username,
            message: data.message});    
      });
      return () => {
        this.socket.disconnect();
      };  
    })     
    return observable;
  }  
}