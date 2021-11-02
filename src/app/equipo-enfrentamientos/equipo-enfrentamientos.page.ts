import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DEFAULT_TIEBREAKING_CRITERIA } from '../models/constants';
import { Enfrentamiento } from '../models/enfrentamiento';
import { Equipo, TiebreakingCriterion } from '../models/equipo';
import { DataService } from '../services/data.service';
import { TranslatorService } from '../services/translator.service';

@Component({
  selector: 'app-equipo-enfrentamientos',
  templateUrl: './equipo-enfrentamientos.page.html',
  styleUrls: ['./equipo-enfrentamientos.page.scss'],
})
export class EquipoEnfrentamientosPage implements OnInit {

  equipo: Equipo;
  equipos: Equipo[];
  teamname: string;
  isTeamLoaded: boolean;
  hasBuchholz: boolean;
  hasMedianBuchholz: boolean;

  equiposSub: Subscription;
  subSub: Subscription;
  tiebreakingCSub: Subscription;
  tiebreaking_criteria: TiebreakingCriterion[];

  constructor(private translator: TranslatorService, private dataService: DataService, route: ActivatedRoute) {
    this.equipos = [];
    this.teamname = '';
    this.isTeamLoaded = false;
    this.hasBuchholz = false;
    this.hasMedianBuchholz = false;
    this.tiebreaking_criteria = DEFAULT_TIEBREAKING_CRITERIA;
    this.subSub = route.params.subscribe(params => {
      this.teamname = params['teamname']
      this.startSubscriptions();
    });
  }

  ngOnInit() {
    this.startSubscriptions();
  }

  ngOnDestroy() {
    this.equiposSub.unsubscribe();
    this.tiebreakingCSub.unsubscribe();
    this.subSub.unsubscribe();
  }

  startSubscriptions() {
    if (this.equiposSub)
      this.equiposSub.unsubscribe();
    this.equiposSub = this.dataService.equipos.subscribe((valor)=>{
      this.equipos = valor;
      this.equipo = this.equipos.find((e) => {
        return e.getNombre() == this.teamname;
      });
      this.isTeamLoaded = this.equipo != undefined;
    });
    if (this.tiebreakingCSub)
      this.tiebreakingCSub.unsubscribe();
    this.tiebreakingCSub = this.dataService.tiebreaking_criteria.subscribe((valor) => {
      this.tiebreaking_criteria = valor;
      this.hasBuchholz = this.tiebreaking_criteria.includes(TiebreakingCriterion.BUCHHOLZ);
      this.hasMedianBuchholz = this.tiebreaking_criteria.includes(TiebreakingCriterion.MEDIANBUCHHOLZ);
    });
  }

  getTeamName(): string{
    return this.equipo.getNombre();
  }

  indiceDe(enf: Enfrentamiento, enfrentamientos: Enfrentamiento[]){
    return enfrentamientos.indexOf(enf) + 1;
  }

  getBuchholz(): number{
    return this.equipo.getTiebreakingBuchholzValue();
  }

  getMedianBuchholz(): number{
    return this.equipo.getTiebreakingMedianBuchholzValue();
  }

}
