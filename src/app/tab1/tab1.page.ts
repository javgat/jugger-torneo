import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { DEFAULT_AVOID_REPEATED_MATCHES, DEFAULT_FALTAS_DESCALIFICADO_TORNEO, DEFAULT_FALTAS_PERDER_PARTIDO, DEFAULT_TIEBREAKING_CRITERIA } from '../models/constants';
import { Enfrentamiento } from '../models/enfrentamiento';
import { Equipo, TiebreakingCriterion } from '../models/equipo';
import { DataService } from '../services/data.service';
import { TranslatorService } from '../services/translator.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
/**
 * Tab1Page is the page that contains the current round with the matches (Enfrentamiento)
 */
export class Tab1Page {

  equiposSub: Subscription;
  enfrentamientosSub: Subscription;
  faltasDescalificadoSub: Subscription;
  faltasPerderPartSub: Subscription;
  avoidRepeatedSub: Subscription;
  tiebreakingSub: Subscription;
  enfrentamientos: Enfrentamiento[];
  equipos: Equipo[];
  faltas_descalificado: number;
  faltas_perder_partido: number;
  avoid_repeated_matches: boolean;
  tiebreaking_criteria: TiebreakingCriterion[];

  constructor(private translator: TranslatorService, private dataService: DataService) {
    this.faltas_descalificado = DEFAULT_FALTAS_DESCALIFICADO_TORNEO;
    this.faltas_perder_partido = DEFAULT_FALTAS_PERDER_PARTIDO;
    this.avoid_repeated_matches = DEFAULT_AVOID_REPEATED_MATCHES;
    this.equipos = [];
    this.enfrentamientos = [];
    this.tiebreaking_criteria = DEFAULT_TIEBREAKING_CRITERIA;
  }

  ngOnInit() {
    this.enfrentamientosSub = this.dataService.enfrentamientos.subscribe((valor) => {
      this.enfrentamientos = valor;
    });
    this.equiposSub = this.dataService.equipos.subscribe((valor) => {
      this.equipos = valor;
    });
    this.faltasDescalificadoSub = this.dataService.faltas_descalificado.subscribe((valor) => {
      this.faltas_descalificado = valor;
    });
    this.faltasPerderPartSub = this.dataService.faltas_perder_partido.subscribe((valor) => {
      this.faltas_perder_partido = valor;
    });
    this.avoidRepeatedSub = this.dataService.avoid_repeated_matches.subscribe((valor) => {
      this.avoid_repeated_matches = valor;
    });
    this.tiebreakingSub = this.dataService.tiebreaking_criteria.subscribe((valor) => {
      this.tiebreaking_criteria = valor;
    });
  }

  ngOnDestroy() {
    this.enfrentamientosSub.unsubscribe();
    this.equiposSub.unsubscribe();
    this.faltasDescalificadoSub.unsubscribe();
    this.faltasPerderPartSub.unsubscribe();
    this.avoidRepeatedSub.unsubscribe();
    this.tiebreakingSub.unsubscribe();
  }

  advance_round_disabled(): boolean {
    let notFinished = this.enfrentamientos.filter((enf) => {
      return !enf.isResultadosSet();
    });
    return notFinished.length > 0;
  }

  click_advanced_round() {
    this.enfrentamientos.forEach(e => e.finPartido());
    let newEnfs: Enfrentamiento[];
    if (this.avoid_repeated_matches){
      newEnfs = Enfrentamiento.matchGenComplex(this.equipos, this.faltas_descalificado, this.faltas_perder_partido, this.tiebreaking_criteria);
    } else {
      newEnfs = Enfrentamiento.matchGenAllowRepetition(this.equipos, this.faltas_descalificado, this.faltas_perder_partido, this.tiebreaking_criteria);
    }
    this.dataService.setEquipos(this.equipos); // We want to save the Equipos updated in storage
    this.dataService.setEnfrentamientos(newEnfs);
  }

  updateStorageEnfrentamientosData() {
    this.dataService.updateStorageEnfrentamientos(this.enfrentamientos);
  }

  getRoundNumber(): number{
    if (this.equipos.length == 0) {
      return 0;
    }
    return this.equipos[0].getNumberEnfrentamientos() + 1;
  }

  indiceDe(enf: Enfrentamiento, enfrentamientos: Enfrentamiento[]){
    return enfrentamientos.indexOf(enf) + 1;
  }
}
