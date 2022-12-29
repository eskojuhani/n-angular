import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
//import { io, Socket } from 'socket.io-client';

import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  chatMessage = new BehaviorSubject({username: "", message: ""});
  sharedMessage = this.chatMessage.asObservable();

  constructor(private socket: Socket) {
    this.socket.on('console.login', (data) => {
      //connected = true;
      console.log(`${data} on console.login`);
    });

    // Whenever the server emits 'new message', update the chat body
    this.socket.on('new message', (data) => {
      console.log(`${data.username}: ${data.message}`);
      this.chatMessage.next({username: data.username, message: data.message})
    });

    // Whenever the server emits 'user joined', console.log it in the chat body
    this.socket.on('user joined', (data) => {
      console.log(`${data.username} joined`);
    });

    // Whenever the server emits 'user left', console.log it in the chat body
    this.socket.on('user left', (data) => {
      console.log(`${data.username} left`);
    });

    // Whenever the server emits 'typing', show the typing message
    this.socket.on('typing', (data) => {
      console.log(`${data.username} is typing`);
    });

    // Whenever the server emits 'stop typing', kill the typing message
    this.socket.on('stop typing', (data) => {
      console.log(`${data.username} stoppped typing`);
    });

    this.socket.on('disconnect', () => {
      console.log('you have been disconnected');
    });

    this.socket.on('reconnect', () => {
      console.log('you have been reconnected');
    });

    this.socket.on('reconnect_error', () => {
      console.log('attempt to reconnect has failed');
    });
  }

  getMessage() {
    //return this.socket.fromEvent('message').pipe(map((data) => data.msg));
  }
  // EMITTER
  sendMessage(msg: string) {
    console.log("ChatService.sendMessage:", msg);
    this.socket.emit("new message", msg)

    console.log("sendMessage was done in ChatService");
  }
  login(username: string) {
    console.log("ChatService.login:", username);
    this.socket.emit('add user', username);

    console.log("login was done in ChatService");
  }

  // HANDLER
  onNewMessage() {
    return new Observable(observer => {
      this.socket.on('newMessage', msg => {
        observer.next(msg);
      });
    });
  }
}
