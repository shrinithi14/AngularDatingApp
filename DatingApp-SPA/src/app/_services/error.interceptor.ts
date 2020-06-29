import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        if (error.status === 401) {
          return throwError(error.statusText);
        }
        if (error instanceof HttpErrorResponse) {
          const applicationError = error.headers.get('Apllication-Error');
          if (applicationError) {
            return throwError(applicationError);
          }
          let modelstateErrors = '';
          const serveError = error.error;
          if (serveError.errors && typeof serveError.errors === 'object') {
            for (const key in serveError.errors) {
              if (serveError.errors[key]) {
                modelstateErrors += serveError.errors[key];
              }
            }
          }
          return throwError(modelstateErrors || serveError || 'Server Error');
        }
      })
    );
  }
}

export const ErrorInterceptorProvider = {
         provide: HTTP_INTERCEPTORS,
         useClass: ErrorInterceptor,
         multi: true,
       };

