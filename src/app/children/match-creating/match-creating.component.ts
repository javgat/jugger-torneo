import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Enfrentamiento } from 'src/app/models/enfrentamiento';
import { Equipo } from 'src/app/models/equipo';
import { TranslatorService } from 'src/app/services/translator.service';

@Component({
  selector: 'app-match-creating',
  templateUrl: './match-creating.component.html',
  styleUrls: ['./match-creating.component.scss'],
})
/**
 * Component that allows the input of the data to create a new match (Enfrentamiento)
 * and sends it to the parent. Created for nuevo-torneo page.
 */
export class MatchCreatingComponent implements OnInit {

  @Output() createdEvent = new EventEmitter<Enfrentamiento>();

  callParentCreatedEvent() {
    this.createdEvent.emit(this.enfrentamiento);
  }
  
  equipoA: Equipo;
  equipoB: Equipo;
  enfrentamiento: Enfrentamiento;

  firstTeamName: string;
  secondTeamName: string;

  constructor(private translator: TranslatorService) {
    this.firstTeamName = "";
    this.secondTeamName =  "";
  }

  ngOnInit() {}

  click_save_match(){
    this.equipoA = new Equipo(this.firstTeamName);
    this.equipoB = new Equipo(this.secondTeamName);
    this.enfrentamiento = new Enfrentamiento(this.equipoA, this.equipoB);
    this.callParentCreatedEvent();
    this.firstTeamName = "";
    this.secondTeamName =  "";
  }

  create_match_disabled(): boolean{
    if ((this.firstTeamName != undefined && this.firstTeamName != "")
      && (this.secondTeamName != undefined && this.secondTeamName != "")){
        return false;
    }
    return true;
  }


}
