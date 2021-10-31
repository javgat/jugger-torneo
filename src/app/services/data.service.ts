import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DEFAULT_AVOID_REPEATED_MATCHES, DEFAULT_FALTAS_DESCALIFICADO_TORNEO, DEFAULT_FALTAS_PERDER_PARTIDO } from '../models/constants';
import { Enfrentamiento, EnfrentamientoJSON } from '../models/enfrentamiento';
import { Equipo, EquipoJSON } from '../models/equipo';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
/**
 * DataService implements functions and global observables that allow components and page to update
 * information when needed, and to have the updated data.
 */
export class DataService {

  private stTorneoStarted = 'torneo_started';
  private stEnfrentamientos = 'enfrentamientos';
  private stEquipos = 'equipos';
  private stFaltasDescalificado = 'faltas_descalificado';
  private stFaltasPerderPartido = 'faltas_perder_partido';
  private stAvoidRepeatedMatches = 'avoid_repeated_matches';

  constructor(private storageServ: StorageService) {
    storageServ.isInit.subscribe((started)=>{
      if (started){
        this.loadDataStorage();
      }
    });
  }

  private loadDataStorage(){
    this.storageServ.getObject(this.stTorneoStarted).then((v)=>{
      this.setTorneoStarted(v as boolean);
    });
    this.storageServ.getObject(this.stFaltasDescalificado).then((v)=>{
      this.setFaltasDescalificado(v as number);
      this.storageServ.getObject(this.stFaltasPerderPartido).then((v)=>{
        this.setFaltasPerderPartido(v as number);
        this.storageServ.getObject(this.stAvoidRepeatedMatches).then((v)=>{
          this.setAvoidRepeatedMatches(v as boolean);
          this.storageServ.getObject(this.stEquipos).then((v)=>{
            if (Array.isArray(v)){
              let eqs: Equipo[] = Equipo.createFromJSONS(v as EquipoJSON[]);
              this.setEquipos(eqs);
              this.storageServ.getObject(this.stEnfrentamientos).then((v)=>{
                this.setEnfrentamientosFromJSON(v as EnfrentamientoJSON[], eqs);
              });
            }
          });
        });
      });
    });
  }

  /**
   * TORNEO STARTED 
   * torneo started indicates if the tournament has started or false if it is still being created.
   */
  private torneo_started = new BehaviorSubject<boolean>(false);
  torneoStarted = this.torneo_started.asObservable();

  setTorneoStarted(started: boolean){
    this.torneo_started.next(started);
    this.storageServ.setObject(this.stTorneoStarted, started);
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
    this.storageServ.clear();
  }

  /**
   * EQUIPOS
   * equipos are the teams participating
   */
  private _equipos = new BehaviorSubject<Equipo[]>([]);
  equipos = this._equipos.asObservable();


  setEquipos(eqs: Equipo[]){
    this._equipos.next(eqs);
    let eqsjson: EquipoJSON[] = [];
    for (let eq of eqs){
      eqsjson.push(eq.toJSON());
    }
    this.storageServ.setObject(this.stEquipos, eqsjson);
  }

  /**
   * ENFRENTAMIENTOS
   * enfrentamientos are the matches in this round
   */
  private _enfrentamientos = new BehaviorSubject<Enfrentamiento[]>([]);
  enfrentamientos = this._enfrentamientos.asObservable();

  setEnfrentamientos(enfs: Enfrentamiento[]){
    this._enfrentamientos.next(enfs);
    this.updateStorageEnfrentamientos(enfs);
  }

  updateStorageEnfrentamientos(enfs: Enfrentamiento[]){
    let enfsjson: EnfrentamientoJSON[] = [];
    for (let enf of enfs){
      enfsjson.push(enf.toJSON());
    }
    this.storageServ.setObject(this.stEnfrentamientos, enfsjson);
  }

  private setEnfrentamientosFromJSON(enfsJs: EnfrentamientoJSON[], eqs: Equipo[]){
    let enfs: Enfrentamiento[] = [];
    for (let enfJs of enfsJs){
      enfs.push(Enfrentamiento.createFromJSON(enfJs, eqs));
    }
    this.setEnfrentamientos(enfs);
  }

  /**
   * FALTAS_DESCALIFICADO
   * Number of faults that if it is reached by a team in the tournament, they are disqualified
   */
  private _faltas_descalificado = new BehaviorSubject<number>(DEFAULT_FALTAS_DESCALIFICADO_TORNEO);
  faltas_descalificado = this._faltas_descalificado.asObservable();

  setFaltasDescalificado(n: number){
    this._faltas_descalificado.next(n);
    this.storageServ.setObject(this.stFaltasDescalificado, n);
  }

  /**
   * FALTAS_PERDER_PARTIDO
   * Number of faults thart if it is reached by a team in a match, they lose the match
   */
  private _faltas_perder_partido = new BehaviorSubject<number>(DEFAULT_FALTAS_PERDER_PARTIDO);
  faltas_perder_partido = this._faltas_perder_partido.asObservable();

  setFaltasPerderPartido(n: number){
    this._faltas_perder_partido.next(n);
    this.storageServ.setObject(this.stFaltasPerderPartido, n);
  }

  /**
   * AVOID_REPEATED_MATCHES
   * Boolean value that is true in case that the pairing algorythm should avoid that teams repeat adversaries
   */
  private _avoid_repeated_matches = new BehaviorSubject<boolean>(DEFAULT_AVOID_REPEATED_MATCHES);
  avoid_repeated_matches = this._avoid_repeated_matches.asObservable();

  setAvoidRepeatedMatches(b: boolean){
    this._avoid_repeated_matches.next(b);
    this.storageServ.setObject(this.stAvoidRepeatedMatches, b);
  }
}
