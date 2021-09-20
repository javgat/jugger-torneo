import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  private _is_init = new BehaviorSubject<boolean>(false);
  isInit = this._is_init.asObservable();

  constructor(private storage: Storage) {
    this.init();
  }

  private async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    this.storage.create().then((st)=>{
      const storage = st;
      this._storage = storage;
      this._is_init.next(true);
    });
  }

  public isReady(): boolean{
    return this._storage != null;
  }

  public setObject(key: string, value: any): Promise<any> {
    return this._storage?.set(key, JSON.stringify(value));
  }

  public getObject(key: string): Promise<any> {
    return this._storage?.get(key).then((v) => {
      return JSON.parse(v);
    });
  }

  public clear(): Promise<any> {
    return this._storage?.clear();
  }
}