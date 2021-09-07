import { Component, Input, OnInit } from '@angular/core';
import { Equipo } from 'src/app/models/equipo';
import { TranslatorService } from 'src/app/services/translator.service';

@Component({
  selector: 'app-team-ranking',
  templateUrl: './team-ranking.component.html',
  styleUrls: ['./team-ranking.component.scss'],
})
/**
 * Component that represents an ion-item with the information of a team (Equipo) that will fit in the teams ranking (tab2)
 */
export class TeamRankingComponent implements OnInit {

  @Input() position: number;
  @Input() equipo: Equipo;

  constructor(private translator: TranslatorService) { }

  ngOnInit() {}

}
