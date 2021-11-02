import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DEFAULT_TIEBREAKING_CRITERIA } from '../models/constants';
import { Equipo, TiebreakingCriterion } from '../models/equipo';
import { DataService } from '../services/data.service';
import { TranslatorService } from '../services/translator.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
/**
 * Tab2Page is the page that contains the current ranking of the teams (Equipo)
 */
export class Tab2Page {

  equiposSub: Subscription;
  subSub: Subscription;
  tiebreakingSub: Subscription;

  equipos: Equipo[];
  tiebreaking_criteria: TiebreakingCriterion[];

  constructor(private translator: TranslatorService, private dataService: DataService,
    route: ActivatedRoute, private router: Router) {
    this.equipos = [];
    this.tiebreaking_criteria = DEFAULT_TIEBREAKING_CRITERIA;
    this.subSub = route.params.subscribe(val => {
      this.startSubscriptions();
    });
  }

  ngOnInit() {
    this.startSubscriptions();
  }

  ngOnDestroy() {
    this.equiposSub.unsubscribe();
    this.subSub.unsubscribe();
    this.tiebreakingSub.unsubscribe();
  }

  startSubscriptions() {
    if (this.equiposSub)
      this.equiposSub.unsubscribe();
    this.equiposSub = this.dataService.equipos.subscribe((valor)=>{
      this.equipos = valor;
      this.sortTeams();
    });
    if (this.tiebreakingSub)
      this.tiebreakingSub.unsubscribe();
    this.tiebreakingSub = this.dataService.tiebreaking_criteria.subscribe((valor) => {
      this.tiebreaking_criteria = valor;
    });
  }

  sortTeams(){
    Equipo.sortTeamsRanking(this.equipos, this.tiebreaking_criteria);
  }

  getPosition(i: number): number{
    if (i == 0){
      return 1;
    }
    if (this.equipos[i].compareTo(this.equipos[i-1], this.tiebreaking_criteria) == 0){
      return this.getPosition(i-1);
    }
    return i+1;
  }

  clickedTeam(eq: Equipo){
    this.router.navigate(['/equipo-enfrentamientos/' + eq.getNombre()]);
  }

}
