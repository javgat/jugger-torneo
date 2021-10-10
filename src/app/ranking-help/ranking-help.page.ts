import { Component, OnInit } from '@angular/core';
import { TranslatorService } from '../services/translator.service';

@Component({
  selector: 'app-ranking-help',
  templateUrl: './ranking-help.page.html',
  styleUrls: ['./ranking-help.page.scss'],
})
export class RankingHelpPage implements OnInit {

  constructor(private translator: TranslatorService) { }

  ngOnInit() {
  }

}
