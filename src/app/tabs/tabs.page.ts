import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../services/data.service';
import { StorageService } from '../services/storage.service';
import { TranslatorService } from '../services/translator.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  torneoStarted: boolean;
  torneoStartedSub: Subscription;
  subSub: Subscription;

  constructor(private translator: TranslatorService, private dataService: DataService, private router: Router,
      private route: ActivatedRoute, private storageService: StorageService) {
    this.subSub = route.params.subscribe(val => {
      this.startSubscriptions();
    });
  }

  ngOnInit() {
    this.startSubscriptions();
  }

  ngOnDestroy() {
    this.torneoStartedSub.unsubscribe();
    this.subSub.unsubscribe();
  }

  startSubscriptions(){
    if(this.torneoStartedSub)
      this.torneoStartedSub.unsubscribe();
    this.torneoStartedSub = this.dataService.torneoStarted.subscribe((valor)=>{
      this.torneoStarted = valor.valueOf();
      this.checkIfChange();
    });
  }

  checkIfChange(){
    if (!this.torneoStarted){
      if (this.storageService.isReady()){ // If it navigates back and then again to tabs, it doesn't work correctly
        this.router.navigate(['/']);
      }
    }
  }

}
