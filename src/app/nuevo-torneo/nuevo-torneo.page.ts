import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../services/data.service';
import { TranslatorService } from '../services/translator.service';

@Component({
  selector: 'app-nuevo-torneo',
  templateUrl: './nuevo-torneo.page.html',
  styleUrls: ['./nuevo-torneo.page.scss'],
})
export class NuevoTorneoPage implements OnInit {

  torneoStarted: boolean;
  torneoStartedSub: Subscription;

  constructor(private translator: TranslatorService, private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.dataService.torneoStarted.subscribe((valor)=>{
      this.torneoStarted = valor.valueOf();
      this.checkIfChange();
    });
  }

  ngOnDestroy() {
    this.torneoStartedSub.unsubscribe();
  }

  checkIfChange(){
    if (this.torneoStarted){
      this.router.navigate(['/tabs'])
    }
  }

  click_start_tournament(){
    this.dataService.setTorneoStarted(true);
  }

  start_tournament_disabled(): boolean{
    return true;
  }

}
