import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const userToken = 'no-cache';
    const modifiedReq = req.clone({
      headers: req.headers.set('cache-control', `${userToken}`),
    });
    return next.handle(modifiedReq);
  }
}
