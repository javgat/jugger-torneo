import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IModifiedEntrentamiento } from '../children/match-created/match-created-typings';
import { DEFAULT_FALTAS_DESCALIFICADO_TORNEO, DEFAULT_FALTAS_PERDER_PARTIDO } from '../models/constants';
import { Enfrentamiento } from '../models/enfrentamiento';
import { Equipo } from '../models/equipo';
import { DataService } from '../services/data.service';
import { TranslatorService } from '../services/translator.service';

@Component({
  selector: 'app-nuevo-torneo',
  templateUrl: './nuevo-torneo.page.html',
  styleUrls: ['./nuevo-torneo.page.scss'],
})
/**
 * NuevoTorneoPage is the page that contains the functionality of creating the first
 * matches (Enfrentamiento) and teams (Equipo) for a new tournament
 */
export class NuevoTorneoPage implements OnInit {

  torneoStarted: boolean;
  torneoStartedSub: Subscription;
  enfrentamientosSub: Subscription;
  subSub: Subscription;
  enfrentamientos: Enfrentamiento[];
  faltas_descalificado_torneo: number;
  faltas_perder_partido: number;
  avoid_repeated_matches: boolean;

  constructor(private translator: TranslatorService, private dataService: DataService, private router: Router, private route: ActivatedRoute) {
    this.enfrentamientos = [];
    this.faltas_descalificado_torneo = DEFAULT_FALTAS_DESCALIFICADO_TORNEO;
    this.faltas_perder_partido = DEFAULT_FALTAS_PERDER_PARTIDO;
    this.avoid_repeated_matches = true;
    this.subSub = route.params.subscribe(val => {
      this.startSubscriptions();
    });
  }

  ngOnInit() {
    this.startSubscriptions();
  }

  ngOnDestroy() {
    this.torneoStartedSub.unsubscribe();
    this.enfrentamientosSub.unsubscribe();
    this.subSub.unsubscribe();
  }

  startSubscriptions(){
    if (this.torneoStartedSub)
      this.torneoStartedSub.unsubscribe();
    if (this.enfrentamientosSub)
      this.enfrentamientosSub.unsubscribe();
    this.torneoStartedSub = this.dataService.torneoStarted.subscribe((valor)=>{
      this.torneoStarted = valor;
      this.checkIfChange();
    });
    this.enfrentamientosSub = this.dataService.enfrentamientos.subscribe((valor)=>{
      this.enfrentamientos = valor;
    });
  }

  checkIfChange(){
    if (this.torneoStarted){
      this.router.navigate(['/tabs']);
    }
  }

  click_start_tournament(){
    for (let enf of this.enfrentamientos){
      enf.equipoA.setFaltasDescalificado(this.faltas_descalificado_torneo);
      enf.equipoB.setFaltasDescalificado(this.faltas_descalificado_torneo);
      enf.setFaltasDescalificadoTorneo(this.faltas_descalificado_torneo);
      enf.setFaltasPerderPartido(this.faltas_perder_partido);
    }
    this.dataService.setFaltasDescalificado(this.faltas_descalificado_torneo);
    this.dataService.setFaltasPerderPartido(this.faltas_perder_partido);
    this.dataService.setAvoidRepeatedMatches(this.avoid_repeated_matches);
    this.dataService.startTorneo(this.enfrentamientos);
  }

  private isRepeatedNameEquipo(): boolean{
    for (let i = 0; i < this.enfrentamientos.length; i++){
      let nomEqA = this.enfrentamientos[i].equipoA.getNombre();
      let nomEqB = this.enfrentamientos[i].equipoB.getNombre();
      if (nomEqA == nomEqB){
        return true;
      }
      for (let j = i+1; j < this.enfrentamientos.length; j++){
        let eqA = this.enfrentamientos[j].equipoA;
        let eqB = this.enfrentamientos[j].equipoB;
        if (nomEqA == eqA.getNombre() || nomEqA == eqB.getNombre() ||
          nomEqB == eqA.getNombre() || nomEqB == eqB.getNombre()){
            return true;
          }
      }
    }
    return false;
  }

  start_tournament_disabled(): boolean{
    return this.enfrentamientos.length==0 || this.isRepeatedNameEquipo();
  }

  new_match(enf: Enfrentamiento){
    this.enfrentamientos.push(enf);
  }

  delete_match(enf: Enfrentamiento){
    this.enfrentamientos = this.enfrentamientos.filter((v) => {
      return (v.equipoA.getNombre() != enf.equipoA.getNombre() ||
      v.equipoB.getNombre() != enf.equipoB.getNombre());
    });
  }

  modify_match(modEnf: IModifiedEntrentamiento){
    let oldEnf = modEnf.enfrentamiento;
    this.enfrentamientos = this.enfrentamientos.map( (enf) => {
      if (enf.equipoA.getNombre() == oldEnf.equipoA.getNombre() &&
      enf.equipoB.getNombre() == oldEnf.equipoB.getNombre()){
        return modEnf.newEnfrentamiento;
      }
      return enf;
    });
  }

  indiceDe(enf: Enfrentamiento, enfrentamientos: Enfrentamiento[]){
    return enfrentamientos.indexOf(enf) + 1;
  }

}
