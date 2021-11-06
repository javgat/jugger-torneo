import { Component, OnInit } from '@angular/core';
import { TranslatorService } from '../services/translator.service';

@Component({
  selector: 'app-tiebreaking-c-help',
  templateUrl: './tiebreaking-c-help.page.html',
  styleUrls: ['./tiebreaking-c-help.page.scss'],
})
export class TiebreakingCHelpPage implements OnInit {

  constructor(private translator: TranslatorService) { }

  ngOnInit() {
  }

}
