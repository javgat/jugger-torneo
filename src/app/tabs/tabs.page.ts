import { Component } from '@angular/core';
import { TranslatorService } from '../services/translator.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private translator: TranslatorService) {}

}
