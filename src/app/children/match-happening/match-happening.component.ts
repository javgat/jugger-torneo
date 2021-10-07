import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Enfrentamiento, SelectWinner } from 'src/app/models/enfrentamiento';
import { TranslatorService } from 'src/app/services/translator.service';

@Component({
  selector: 'app-match-happening',
  templateUrl: './match-happening.component.html',
  styleUrls: ['./match-happening.component.scss'],
})
/**
 * Component that represents a Match that is happening (or just happened) and lets the user inputs the results of the match (and edit it). Relates to tab1
 */
export class MatchHappeningComponent implements OnInit {

  @Input() enfrentamiento: Enfrentamiento;

  @Input() indice: number;

  @Output() clickedSaveDataEvent = new EventEmitter<any>();

  callParentClickedSaveDataEvent() {
    this.clickedSaveDataEvent.emit();
  }

  inputGolesA: number;
  inputGolesB: number;
  inputFaltasA: number;
  inputFaltasB: number;
  winner_select_val: SelectWinner;
  showSelectWinner: boolean;

  constructor(private translator: TranslatorService) {
    this.winner_select_val = SelectWinner.AUTOMATICO;
    this.showSelectWinner = false;
  }

  ngOnInit() {
    this.winner_select_val = this.enfrentamiento.selectWinner;
    this.inputGolesA = this.enfrentamiento.golesA;
    this.inputGolesB = this.enfrentamiento.golesB;
    this.inputFaltasA = this.enfrentamiento.faltasA;
    this.inputFaltasB = this.enfrentamiento.faltasB;
    if (this.winner_select_val != SelectWinner.AUTOMATICO){
      this.showSelectWinner = true;
    }
  }

  isEditing(): boolean{
    return !this.enfrentamiento.isResultadosSet();
  }

  getNameA(): string{
    return this.enfrentamiento.equipoA.getNombre();
  }

  getNameB(): string{
    return this.enfrentamiento.equipoB.getNombre();
  }

  getGolesA(): string{
    return this.enfrentamiento.golesA.toString();
  }

  getGolesB(): string{
    return this.enfrentamiento.golesB.toString();
  }

  getFaltasA(): string{
    return this.enfrentamiento.faltasA.toString();
  }

  getFaltasB(): string{
    return this.enfrentamiento.faltasB.toString();
  }

  isEmpate(): boolean{
    return this.enfrentamiento.isEmpate();
  }

  getGanador(): string{
    if (this.enfrentamiento.isEquipoAWinner()){
      return this.getNameA();
    } else if (this.enfrentamiento.isEquipoBWinner()){
      return this.getNameB();
    }
    return "";
  }

  getEnumAutomaticVal(): number{
    return SelectWinner.AUTOMATICO;
  }

  getEnumEquipoAVal(): number{
    return SelectWinner.EQUIPOA;
  }

  getEnumEquipoBVal(): number{
    return SelectWinner.EQUIPOB;
  }

  getEnumEmpateVal(): number{
    return SelectWinner.EMPATE;
  }

  compare_select(n1: number, n2:number): boolean{
    return n1 == n2;
  }

  is_ganador_disabled(): boolean{
    return this.inputGolesA == undefined || this.inputGolesB == undefined;
  }

  click_edit_winner(): void{
    this.showSelectWinner = !this.showSelectWinner;
  }

  inputChanged(): void{
    if (this.is_ganador_disabled()){
      this.clearDataEnfrentamiento();
    } else {
      this.updateDataEnfrentamiento();
    }
  }

  updateDataEnfrentamiento(): void{
    if (this.enfrentamiento.isResultadosSet()){
      this.enfrentamiento.unsetResultado();
    }
    this.saveDataEnfrentamiento();
  }

  saveDataEnfrentamiento(){
    let faltasA = this.inputFaltasA || 0;
    let faltasB = this.inputFaltasB || 0;

    this.enfrentamiento.setResultados(this.inputGolesA, faltasA, this.inputGolesB, faltasB);
    if (this.winner_select_val == SelectWinner.EQUIPOA) {
      this.enfrentamiento.setForcedGanadorA();
    } else if (this.winner_select_val == SelectWinner.EQUIPOB) {
      this.enfrentamiento.setForcedGanadorB();
    } else if (this.winner_select_val == SelectWinner.EMPATE) {
      this.enfrentamiento.setForcedEmpate();
    }
    this.callParentClickedSaveDataEvent();
  }

  clearDataEnfrentamiento(){
    this.enfrentamiento.unsetResultado();
  }

}