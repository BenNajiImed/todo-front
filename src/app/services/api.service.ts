import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, tap } from "rxjs";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  todos:any =[];
  private token='';
  private jwtToken$ = new BehaviorSubject<string>(this.token);
  private API_URL = 'http://localhost:3000'
  constructor(private http: HttpClient,
    private router: Router,
    private cookieService:CookieService,
    private toast: ToastrService,) {
      const fetchedToken = cookieService.get('jwt');
      if(fetchedToken){
        this.token = atob(fetchedToken);
        this.jwtToken$.next(this.token);
      }
     }
  get jwtUserToken(): Observable<string>{
    return this.jwtToken$.asObservable();
  }


  //Getting All Todos
    getAllTodos(): Observable<any>{
    return this.http.get(`${this.API_URL}/todos`);
  }


    login(username: string, password: string){
    // @ts-ignore
      this.http.post(`${this.API_URL}/auth/login`, {username, password}).subscribe((res: HttpResponse) => {
        this.token = res.token;
        if (this.token) {
          this.toast.success("Login successful, redirection now...", "", {
            timeOut: 700,
            positionClass: "toast-top-center"
          }).onHidden.toPromise().then(() => {
            this.jwtToken$.next(this.token);
            this.cookieService.set('jwt',btoa(this.token), 1/2);
            /*localStorage.setItem("act", btoa(this.token);*/
            this.router.navigateByUrl("/").then();
          });
        }
      },
      (err: HttpErrorResponse) => {
        this.toast.error(`Authentication failed, ${err.error.message}`, "", {
          timeOut: 1000
        });
      });
    }

    register(username: string, password: string, Cpassword: string){
      this.http.post(`${this.API_URL}/auth/register`, {username, password, Cpassword}).subscribe((res:any) =>{
        if(res.username){
          this.toast.success('register successful, you can login now','',{
            timeOut: 1000,
            positionClass: 'toast-top-center'
          }).onHidden.toPromise().then(()=>{
            this.router.navigateByUrl('/login').then();
          });
        }}, (err:HttpErrorResponse)=>{
        console.log(err.error.message);
        this.toast.error(err.error.message, '', {
          timeOut: 4000
        });
      });
    }
    logout(){
      this.token='';
      this.jwtToken$.next(this.token);
      this.toast.success('Logged out successfully','',{
        timeOut: 500
      }).onHidden.subscribe(()=>{
        this.cookieService.delete('jwt');
        /*localStorage.removeItem('act');*/
        this.router.navigateByUrl('/login').then();
      });
      return '';
    }

    createTodo(title: string, description: string){
      return this.http.post(`${this.API_URL}/todos`, {title, description})
    }



    updateStatus(statusValue: string, todoId: number){
      return this.http.patch(`${this.API_URL}/todos/${todoId}`, {status: statusValue}).pipe(
        tap ( res =>{
        if(res){
          this.toast.success('Status updated successfully', '', {
            timeOut:1000
          })
        }
      })
      );
    }

    deleteTodo(todoId: number){
      return this.http.delete(`${this.API_URL}/todos/${todoId}`).pipe(
        tap ( (res:any) =>{
        if(res.success){
          this.toast.success('Todo deleted successfully');
        }
      })
      );
    }

}

