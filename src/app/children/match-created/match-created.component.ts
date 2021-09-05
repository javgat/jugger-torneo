import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Enfrentamiento } from 'src/app/models/enfrentamiento';
import { TranslatorService } from 'src/app/services/translator.service';

@Component({
  selector: 'app-match-created',
  templateUrl: './match-created.component.html',
  styleUrls: ['./match-created.component.scss'],
})
export class MatchCreatedComponent implements OnInit {

  @Input() enfrentamiento: Enfrentamiento;

  @Output() deletedEvent = new EventEmitter<Enfrentamiento>();

  callParentDeletedEvent() {
    this.deletedEvent.emit(this.enfrentamiento)
  }

  constructor(private translator: TranslatorService) { }

  ngOnInit() {}

  getFirstName(): string{
    if (!this.enfrentamiento){
      return "";
    }
    return this.enfrentamiento.equipoA.getNombre();
  }

  getSecondName(): string{
    if (!this.enfrentamiento){
      return "";
    }
    return this.enfrentamiento.equipoB.getNombre();
  }

  select_delete_pressed(){
    this.callParentDeletedEvent();
  }
}
