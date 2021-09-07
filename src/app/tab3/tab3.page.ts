import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { TranslatorService } from '../services/translator.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
/**
 * Tab3Page is the page that contains options, such as deleting the tournament
 */
export class Tab3Page {

  constructor(private translator: TranslatorService, private dataService: DataService) {}

  select_delete_pressed(){
    this.dataService.resetTorneo();
  }

}
