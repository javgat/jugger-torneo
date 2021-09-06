import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Equipo } from '../models/equipo';
import { DataService } from '../services/data.service';
import { TranslatorService } from '../services/translator.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  equiposSub: Subscription;

  equipos: Equipo[];

  constructor(private translator: TranslatorService, private dataService: DataService) {
    this.equipos = [];
  }

  ngOnInit() {
    this.equiposSub = this.dataService.equipos.subscribe((valor)=>{
      this.equipos = valor;
      this.sortTeams();
    });
  }

  ngOnDestroy() {
    this.equiposSub.unsubscribe();
  }

  sortTeams(){
    this.equipos.sort((ea, eb) =>{
      return eb.compareTo(ea); // reverse order, so large goes first
    });
  }

  getPosition(i: number): number{
    if (i == 0){
      return 1;
    }
    if (this.equipos[i].compareTo(this.equipos[i-1]) == 0){
      return this.getPosition(i-1);
    }
    return i+1;
  }

}
