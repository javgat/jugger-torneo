import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private torneo_started = new BehaviorSubject<Boolean>(new Boolean(false))
  torneoStarted = this.torneo_started.asObservable()

  constructor() { }

  setTorneoStarted(started: boolean){
    this.torneo_started.next(started);
  }
}
