import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { from, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { KvStoreService } from '../services/kv-store.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const kv = inject(KvStoreService);
  const router = inject(Router);

  return from(kv.get<string>('token')).pipe(
    switchMap(token => {
      const authReq = (token && !req.headers.has('Authorization'))? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req

      return next(authReq).pipe(
        catchError(err => {
          if (err?.status === 401) {
            void kv.del('token')
            void kv.del('user')
            router.navigate(['/auth/login'])
          }
          return throwError(() => err);
        })
      )
    })
  )
}