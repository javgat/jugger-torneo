import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Enfrentamiento } from '../models/enfrentamiento';
import { DataService } from '../services/data.service';
import { TranslatorService } from '../services/translator.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  
  enfrentamientosSub: Subscription;
  enfrentamientos: Enfrentamiento[];

  constructor(private translator: TranslatorService, private dataService: DataService) {}

  ngOnInit() {
    this.enfrentamientosSub = this.dataService.enfrentamientos.subscribe((valor)=>{
      this.enfrentamientos = valor;
    });
  }

  ngOnDestroy() {
    this.enfrentamientosSub.unsubscribe();
  }

  advance_round_disabled(): boolean{
    let notFinished = this.enfrentamientos.filter((enf) => {
      return !enf.isResultadosSet();
    });
    return notFinished.length > 0;
  }

  click_advanced_round(){
    // TODO
    this.enfrentamientos.forEach(e => e.finPartido());
  }

}
