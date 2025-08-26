import { CanActivateFn, Router } from '@angular/router';
import { KvStoreService } from '../services/kv-store.service';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = async() => {
  const kv = inject(KvStoreService)
  const router = inject(Router)

  const token: string | null = <string | null> await kv.get('token')
  if(!token) {
    router.navigate(['/auth/login'])
    return false
  }

  const { exp } = jwtDecode(token)
  if(!exp) {
    router.navigate(['/auth/login'])
    return false
  }
  const now = Math.floor(Date.now() / 1000)

  if(exp < now) {
    router.navigate(['/auth/login'])
    return false
  }
  return true
};
