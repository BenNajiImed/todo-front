import { Injectable, OnInit } from "@angular/core";
import { io, Socket } from "socket.io-client";
import jwtDecode from "jwt-decode";
import { ApiService } from "../services/api.service";
@Injectable()
export  class SocketService implements OnInit{

  name:string ='';
  public socketClient: Socket;
  public data:any[]=[];
  joined: boolean = false;

  constructor(private apiService: ApiService) {
    this.socketClient = io('http://localhost:3001');
    this.socketClient.on('connect',()=>{
      console.log('connected to Gateway');
    })
    this.apiService.jwtUserToken.subscribe(token =>{
      if(token){
        const decoded:any = jwtDecode(token);
        this.name = decoded.username;
      }
    });
  }

  getData(){
    this.socketClient.emit('findAllMessages',{}, (response:any)=>{
      this.data=response;
      console.log(this.data);
    })
    this.socketClient.on('message',(message)=>{
      this.data.push(message);
    })
  }
  ngOnInit(){}
  join() {
    this.socketClient.emit('join',{name:this.name}, ()=>{
      this.joined=true;
    })
  }
  registerConsumerEvents (message:string){
    this.socketClient.emit('createMessage', {name:this.name,text:message})
    /*this.socketClient.emit('newMessage', {msg:message})*/
  }
}
