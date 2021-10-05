import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Enfrentamiento } from '../models/enfrentamiento';
import { Equipo } from '../models/equipo';
import { DataService } from '../services/data.service';
import { TranslatorService } from '../services/translator.service';

@Component({
  selector: 'app-equipo-enfrentamientos',
  templateUrl: './equipo-enfrentamientos.page.html',
  styleUrls: ['./equipo-enfrentamientos.page.scss'],
})
export class EquipoEnfrentamientosPage implements OnInit {

  equipo: Equipo;
  equipos: Equipo[];
  teamname: string;
  isTeamLoaded: boolean;

  equiposSub: Subscription;
  subSub: Subscription;

  constructor(private translator: TranslatorService, private dataService: DataService, route: ActivatedRoute) {
    this.equipos = [];
    this.teamname = '';
    this.isTeamLoaded = false;
    this.subSub = route.params.subscribe(params => {
      this.teamname = params['teamname']
      this.startSubscriptions();
    });
  }

  ngOnInit() {
    this.startSubscriptions();
  }

  ngOnDestroy() {
    this.equiposSub.unsubscribe();
    this.subSub.unsubscribe();
  }

  startSubscriptions() {
    if (this.equiposSub)
      this.equiposSub.unsubscribe();
    this.equiposSub = this.dataService.equipos.subscribe((valor)=>{
      this.equipos = valor;
      console.log(this.teamname);
      this.equipo = this.equipos.find((e) => {
        return e.getNombre() == this.teamname;
      });
      this.isTeamLoaded = this.equipo != undefined;
    });
  }

  getTeamName(): string{
    return this.equipo.getNombre();
  }

  indiceDe(enf: Enfrentamiento, enfrentamientos: Enfrentamiento[]){
    return enfrentamientos.indexOf(enf) + 1;
  }

}
