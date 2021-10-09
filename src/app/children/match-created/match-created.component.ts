import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonSelect } from '@ionic/angular';
import { DEFAULT_FALTAS_DESCALIFICADO_TORNEO, DEFAULT_FALTAS_PERDER_PARTIDO } from 'src/app/models/constants';
import { Enfrentamiento } from 'src/app/models/enfrentamiento';
import { Equipo } from 'src/app/models/equipo';
import { TranslatorService } from 'src/app/services/translator.service';
import { IModifiedEntrentamiento } from './match-created-typings';

@Component({
  selector: 'app-match-created',
  templateUrl: './match-created.component.html',
  styleUrls: ['./match-created.component.scss'],
})
/**
 * Component that represents the data of a match (Enfrentamiento) that is being created
 * at the same time as the tournament, and allows the user to delete it, sending the data
 * to the parent component. Created for nuevo-torneo page.
 */
export class MatchCreatedComponent implements OnInit {

  @Input() indice: number;

  @Input() enfrentamiento: Enfrentamiento;

  @Output() deleted = new EventEmitter<Enfrentamiento>();

  @Output() modified = new EventEmitter<IModifiedEntrentamiento>();
  
  isEditing: boolean;
  firstTeamName: string;
  secondTeamName: string;

  callParentDeletedEvent() {
    this.deleted.emit(this.enfrentamiento);
  }

  callParentModifiedEvent(modEnf: IModifiedEntrentamiento) {
    this.modified.emit(modEnf);
  }

  constructor(private translator: TranslatorService) {
    this.isEditing = false;
    this.firstTeamName = '';
    this.secondTeamName = '';
  }

  ngOnInit() {
    if (this.enfrentamiento != undefined){
      this.firstTeamName = this.enfrentamiento.equipoA.getNombre();
      this.secondTeamName = this.enfrentamiento.equipoB.getNombre(); 
    }
  }

  getFirstName(): string{
    if (!this.enfrentamiento){
      return '';
    }
    return this.enfrentamiento.equipoA.getNombre();
  }

  getSecondName(): string{
    if (!this.enfrentamiento){
      return '';
    }
    return this.enfrentamiento.equipoB.getNombre();
  }

  select_pressed(event: any){
    let target: IonSelect = event.target;
    let selectedValue: string = target.value;
    target.value = '';
    if (selectedValue == this.getSelectDeleteValue()){
      this.callParentDeletedEvent();
    } else if (selectedValue == this.getSelectEditValue()){
      this.startEditing();
    }
  }

  startEditing(){
    this.firstTeamName = this.enfrentamiento.equipoA.getNombre();
    this.secondTeamName = this.enfrentamiento.equipoB.getNombre();
    this.isEditing = true;
  }

  saveEditing(){
    let newEquipoA = new Equipo(this.firstTeamName, DEFAULT_FALTAS_DESCALIFICADO_TORNEO);
    let newEquipoB = new Equipo(this.secondTeamName, DEFAULT_FALTAS_DESCALIFICADO_TORNEO);
    let newEnfrentamiento = new Enfrentamiento(newEquipoA, newEquipoB, DEFAULT_FALTAS_DESCALIFICADO_TORNEO, DEFAULT_FALTAS_PERDER_PARTIDO);
    let modified: IModifiedEntrentamiento = {
      enfrentamiento: this.enfrentamiento,
      newEnfrentamiento: newEnfrentamiento
    };
    this.stopEditing();
    this.callParentModifiedEvent(modified);
  }

  cancelEditing(){
    this.firstTeamName = this.enfrentamiento.equipoA.getNombre();
    this.secondTeamName = this.enfrentamiento.equipoB.getNombre();
    this.stopEditing();
  }

  stopEditing(){
    this.isEditing = false;
  }

  save_edit_match_disabled(): boolean{
    if ((this.firstTeamName != undefined && this.firstTeamName != "")
      && (this.secondTeamName != undefined && this.secondTeamName != "")){
        return false;
    }
    return true;
  }

  click_save_edit(){
    this.saveEditing();
  }

  click_cancel_edit(){
    this.cancelEditing();
  }

  getSelectEditValue(): string{
    return 'edit';
  }

  getSelectDeleteValue(): string{
    return 'delete';
  }
}
