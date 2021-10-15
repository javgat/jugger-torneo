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
    if (this.enfrentamiento.isResultadosSet()) {
      this.winner_select_val = this.enfrentamiento.selectWinner;
      this.inputGolesA = this.enfrentamiento.golesA;
      this.inputGolesB = this.enfrentamiento.golesB;
      this.inputFaltasA = this.enfrentamiento.faltasA;
      this.inputFaltasB = this.enfrentamiento.faltasB;
      if (this.winner_select_val != SelectWinner.AUTOMATICO) {
        this.showSelectWinner = true;
      }
    }
  }

  /////
  // UI
  /////

  // Show data in UI

  getNameA(): string {
    return this.enfrentamiento.equipoA.getNombre();
  }

  getNameB(): string {
    return this.enfrentamiento.equipoB.getNombre();
  }

  getGanador(): string {
    if (this.enfrentamiento.isResultadosSet()) {
      if (this.enfrentamiento.isEquipoAWinner()) {
        return this.getNameA();
      } else if (this.enfrentamiento.isEquipoBWinner()) {
        return this.getNameB();
      }
    }
    return "";
  }

  // Values functions and data for UI functioning (not conditionals nor data to be shown)

  getEnumAutomaticVal(): number {
    return SelectWinner.AUTOMATICO;
  }

  getEnumEquipoAVal(): number {
    return SelectWinner.EQUIPOA;
  }

  getEnumEquipoBVal(): number {
    return SelectWinner.EQUIPOB;
  }

  getEnumEmpateVal(): number {
    return SelectWinner.EMPATE;
  }

  compare_select(n1: number, n2: number): boolean {
    return n1 == n2;
  }

  // Conditionals for showing elements UI

  isEmpate(): boolean {
    if (this.enfrentamiento.isResultadosSet()){
      return this.enfrentamiento.isEmpate();
    }
    return false;
  }

  is_ganador_disabled(): boolean {
    return !this.enfrentamiento.isResultadosSet();
  }

  // Actions called by UI

  click_edit_winner(): void {
    this.showSelectWinner = !this.showSelectWinner;
  }

  inputChanged(): void {
    if (this.notEnoughInputForEnfrentamiento()) {
      this.clearDataEnfrentamiento();
    } else {
      this.updateDataEnfrentamiento();
    }
  }

  /////
  // Other functions
  /////

  private notEnoughInputForEnfrentamiento(): boolean {
    return this.inputGolesA == undefined || this.inputGolesB == undefined;
  }

  private updateDataEnfrentamiento(): void {
    if (this.enfrentamiento.isResultadosSet()) {
      this.enfrentamiento.unsetResultado();
    }
    this.saveDataEnfrentamiento();
  }

  private saveDataEnfrentamiento() {
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

  private clearDataEnfrentamiento() {
    this.enfrentamiento.unsetResultado();
    this.callParentClickedSaveDataEvent();
  }

}