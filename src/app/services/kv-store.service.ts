// src/app/core/kv-store.service.ts
import { Injectable } from '@angular/core';
import { db } from './app-db';

@Injectable({ providedIn: 'root' })
export class KvStoreService {
  async set<T>(key: string, value: T): Promise<void> {
    await db.kv.put({ key, value });
  }

  async get<T = unknown>(key: string): Promise<T | undefined> {
    const row = await db.kv.get(key);
    return row?.value as T | undefined;
  }

  async del(key: string): Promise<void> {
    await db.kv.delete(key);
  }

  async clear(): Promise<void> {
    await db.kv.clear();
  }
}
