import { Component, OnInit } from '@angular/core';
import {ApiService} from "./services/api.service";
import jwtDecode from "jwt-decode";
import { SocketService } from "./socket/socket.service";
import { Subscription } from "rxjs";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  showMenu = true;
  username = '';
  constructor(private apiService: ApiService) {
  }

  ngOnInit(){
    this.apiService.jwtUserToken.subscribe(token =>{
      if(token){
        const decoded:any = jwtDecode(token);
        this.username = decoded.username;
      }

      if(this.username){
        this.showMenu= false;
      }else {
        this.showMenu= true;
      }
    });
  }

  logout(){
    this.username='';
    this.apiService.logout();
  }
}
