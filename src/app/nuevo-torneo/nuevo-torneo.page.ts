import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Enfrentamiento } from '../models/enfrentamiento';
import { DataService } from '../services/data.service';
import { TranslatorService } from '../services/translator.service';

@Component({
  selector: 'app-nuevo-torneo',
  templateUrl: './nuevo-torneo.page.html',
  styleUrls: ['./nuevo-torneo.page.scss'],
})
/**
 * NuevoTorneoPage is the page that contains the functionality of creating the first
 * matches (Enfrentamiento) and teams (Equipo) for a new tournament
 */
export class NuevoTorneoPage implements OnInit {

  torneoStarted: boolean;
  torneoStartedSub: Subscription;
  enfrentamientosSub: Subscription;
  subSub: Subscription;
  enfrentamientos: Enfrentamiento[];

  constructor(private translator: TranslatorService, private dataService: DataService, private router: Router, private route: ActivatedRoute) {
    this.enfrentamientos = [];
    this.subSub = route.params.subscribe(val => {
      this.startSubscriptions();
    });
  }

  ngOnInit() {
    this.startSubscriptions();
  }

  ngOnDestroy() {
    this.torneoStartedSub.unsubscribe();
    this.enfrentamientosSub.unsubscribe();
    this.subSub.unsubscribe();
  }

  startSubscriptions(){
    if (this.torneoStartedSub)
      this.torneoStartedSub.unsubscribe();
    if (this.enfrentamientosSub)
      this.enfrentamientosSub.unsubscribe();
    this.torneoStartedSub = this.dataService.torneoStarted.subscribe((valor)=>{
      this.torneoStarted = valor.valueOf();
      this.checkIfChange();
    });
    this.enfrentamientosSub = this.dataService.enfrentamientos.subscribe((valor)=>{
      this.enfrentamientos = valor;
    });
  }

  checkIfChange(){
    if (this.torneoStarted){
      this.router.navigate(['/tabs']);
    }
  }

  click_start_tournament(){
    this.dataService.startTorneo(this.enfrentamientos);
  }

  start_tournament_disabled(): boolean{
    return this.enfrentamientos.length==0;
  }

  new_match(enf: Enfrentamiento){
    this.enfrentamientos.push(enf);
  }

  delete_match(enf: Enfrentamiento){
    this.enfrentamientos = this.enfrentamientos.filter((v) => {
      return (v.equipoA.getNombre() != enf.equipoA.getNombre() ||
      v.equipoB.getNombre() != enf.equipoB.getNombre());
    });
  }

}
