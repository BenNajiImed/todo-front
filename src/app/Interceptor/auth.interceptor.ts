import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { CookieService } from "ngx-cookie-service";
import { Injectable } from "@angular/core";
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private cookieService:CookieService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const token = atob(this.cookieService.get('jwt'));
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request);
  }
}
