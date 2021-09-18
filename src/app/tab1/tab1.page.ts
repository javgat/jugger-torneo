import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Enfrentamiento } from '../models/enfrentamiento';
import { Equipo } from '../models/equipo';
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
  enfrentamientos: Enfrentamiento[];
  equipos: Equipo[];
  faltas_descalificado: number;
  faltas_perder_partido: number;

  constructor(private translator: TranslatorService, private dataService: DataService) {
    this.equipos = [];
    this.enfrentamientos = [];
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
  }

  ngOnDestroy() {
    this.enfrentamientosSub.unsubscribe();
    this.equiposSub.unsubscribe();
    this.faltasDescalificadoSub.unsubscribe();
    this.faltasPerderPartSub.unsubscribe();
  }

  advance_round_disabled(): boolean {
    let notFinished = this.enfrentamientos.filter((enf) => {
      return !enf.isResultadosSet();
    });
    return notFinished.length > 0;
  }

  click_advanced_round() {
    this.enfrentamientos.forEach(e => e.finPartido());
    let newEnfs: Enfrentamiento[] = Enfrentamiento.matchGenComplex(this.equipos, this.faltas_descalificado, this.faltas_perder_partido);
    this.dataService.setEquipos(this.equipos); // We want to save the Equipos updated in storage
    this.dataService.setEnfrentamientos(newEnfs);
  }

  updateStorageEnfrentamientosData() {
    this.dataService.updateStorageEnfrentamientos(this.enfrentamientos);
  }

  getRoundNumber(): number{
    return this.equipos[0].getNumberEnfrentamientos() + 1;
  }
}
