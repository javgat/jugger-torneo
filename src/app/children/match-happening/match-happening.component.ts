import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Enfrentamiento } from 'src/app/models/enfrentamiento';
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

  @Output() clickedSaveDataEvent = new EventEmitter<any>();

  callParentClickedSaveDataEvent() {
    this.clickedSaveDataEvent.emit();
  }

  inputGolesA: number;
  inputGolesB: number;
  inputFaltasA: number;
  inputFaltasB: number;
  winner_select_val: SelectWinner;

  constructor(private translator: TranslatorService) {
    this.winner_select_val = SelectWinner.AUTOMATICO;
  }

  ngOnInit() {}

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

  is_click_disabled(): boolean{
    return this.inputGolesA == undefined || this.inputGolesB == undefined;
  }

  click_save_data(){
    if (this.inputFaltasA == undefined){
      this.inputFaltasA = 0;
    }
    if (this.inputFaltasB == undefined){
      this.inputFaltasB = 0;
    }

    this.enfrentamiento.setResultados(this.inputGolesA, this.inputFaltasA, this.inputGolesB, this.inputFaltasB);
    if (this.winner_select_val == SelectWinner.EQUIPOA) {
      this.enfrentamiento.setForcedGanadorA();
    } else if (this.winner_select_val == SelectWinner.EQUIPOB) {
      this.enfrentamiento.setForcedGanadorB();
    } else if (this.winner_select_val == SelectWinner.EMPATE) {
      this.enfrentamiento.setForcedEmpate();
    }
    this.callParentClickedSaveDataEvent();
  }

  click_edit_again(){
    this.enfrentamiento.unsetResultado();
  }

}

enum SelectWinner{
  AUTOMATICO,
  EQUIPOA,
  EQUIPOB,
  EMPATE
}