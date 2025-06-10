import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { AuthService } from '../_services/auth/auth';


export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    // add the token to the headers of the request
    request = request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + token
      }
    });
  }
  return next(request);
}
