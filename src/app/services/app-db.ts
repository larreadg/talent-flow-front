import Dexie, { Table } from 'dexie';

export interface KvRow {
  key: string;
  value: unknown;             
}

export class AppDB extends Dexie {
  kv!: Table<KvRow, string>;
  constructor() {
    super('talentflow-db');
    this.version(1).stores({
      kv: '&key'
    });
  }
}

export const db = new AppDB();