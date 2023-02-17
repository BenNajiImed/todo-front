import {Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import {ApiService} from "../services/api.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent  implements OnInit{
  passwordsMatching: boolean=false;
  constructor(private apiService: ApiService) {
  }
  checkPasswords(password: string, cpassword: string){
    return this.passwordsMatching = password == cpassword;
  }
  registerUser(registerForm: NgForm) {
    if(this.passwordsMatching){
      if(registerForm.invalid){
        return;
      }
      const{username, password, Cpassword} = registerForm.value;
      this.apiService.register(username,password,Cpassword);
    }else {
      return;
    }
  }

  ngOnInit(): void {
  }
}
