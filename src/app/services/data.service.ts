import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Enfrentamiento } from '../models/enfrentamiento';
import { Equipo } from '../models/equipo';

@Injectable({
  providedIn: 'root'
})
/**
 * DataService implements functions and global observables that allow components and page to update
 * information when needed, and to have the updated data.
 */
export class DataService {

  private torneo_started = new BehaviorSubject<Boolean>(new Boolean(false))
  torneoStarted = this.torneo_started.asObservable()

  // Teams competing
  private _equipos = new BehaviorSubject<Equipo[]>([]);
  equipos = this._equipos.asObservable();
  
  // Matches in this round
  private _enfrentamientos = new BehaviorSubject<Enfrentamiento[]>([]);
  enfrentamientos = this._enfrentamientos.asObservable();

  constructor() { }

  setTorneoStarted(started: boolean){
    this.torneo_started.next(started);
  }

  setEquipos(eqs: Equipo[]){
    this._equipos.next(eqs);
  }

  setEnfrentamientos(enfs: Enfrentamiento[]){
    this._enfrentamientos.next(enfs);
  }

  startTorneo(enfs: Enfrentamiento[]){
    this.setTorneoStarted(true);
    this.setEnfrentamientos(enfs);
    let eqs: Equipo[] = []
    for (let enf of enfs){
      eqs.push(enf.equipoA);
      eqs.push(enf.equipoB);
    }
    this.setEquipos(eqs);
  }

  resetTorneo(){
    this.setEquipos([]);
    this.setEnfrentamientos([]);
    this.setTorneoStarted(false);
  }
}
