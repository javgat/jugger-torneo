import { Component, Input, OnInit } from '@angular/core';
import { Enfrentamiento } from 'src/app/models/enfrentamiento';
import { TranslatorService } from 'src/app/services/translator.service';

@Component({
  selector: 'app-match-happened',
  templateUrl: './match-happened.component.html',
  styleUrls: ['./match-happened.component.scss'],
})
export class MatchHappenedComponent implements OnInit {

  @Input() enfrentamiento: Enfrentamiento;

  @Input() indice: number;

  
  constructor(private translator: TranslatorService) { }

  ngOnInit() {}

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

}
