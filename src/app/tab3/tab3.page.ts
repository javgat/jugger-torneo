import { Component } from '@angular/core';
import { TranslatorService } from '../services/translator.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(private translator: TranslatorService) {}

}
