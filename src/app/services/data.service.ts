import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DEFAULT_FALTAS_DESCALIFICADO_TORNEO, DEFAULT_FALTAS_PERDER_PARTIDO } from '../models/constants';
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

  constructor() { }

  /**
   * TORNEO STARTED 
   * torneo started indicates if the tournament has started or false if it is still being created.
   */
  private torneo_started = new BehaviorSubject<Boolean>(new Boolean(false))
  torneoStarted = this.torneo_started.asObservable()

  setTorneoStarted(started: boolean){
    this.torneo_started.next(started);
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

  /**
   * EQUIPOS
   * equipos are the teams participating
   */
  private _equipos = new BehaviorSubject<Equipo[]>([]);
  equipos = this._equipos.asObservable();


  setEquipos(eqs: Equipo[]){
    this._equipos.next(eqs);
  }

  /**
   * ENFRENTAMIENTOS
   * enfrentamientos are the matches in this round
   */
  private _enfrentamientos = new BehaviorSubject<Enfrentamiento[]>([]);
  enfrentamientos = this._enfrentamientos.asObservable();

  setEnfrentamientos(enfs: Enfrentamiento[]){
    this._enfrentamientos.next(enfs);
  }

  /**
   * FALTAS_DESCALIFICADO
   * Number of faults that if it is reached by a team in the tournament, they are disqualified
   */
  private _faltas_descalificado = new BehaviorSubject<number>(DEFAULT_FALTAS_DESCALIFICADO_TORNEO);
  faltas_descalificado = this._faltas_descalificado.asObservable();

  setFaltasDescalificado(n: number){
    this._faltas_descalificado.next(n);
  }

  /**
   * FALTAS_PERDER_PARTIDO
   * Number of faults thart if it is reached by a team in a match, they lose the match
   */
  private _faltas_perder_partido = new BehaviorSubject<number>(DEFAULT_FALTAS_PERDER_PARTIDO);
  faltas_perder_partido = this._faltas_perder_partido.asObservable();

  setFaltasPerderPartido(n: number){
    this._faltas_perder_partido.next(n);
  }
}
