import { Component, OnInit } from '@angular/core';
import { ItemReorderEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { ALL_TIEBREAKING_CRITERIA, DEFAULT_TIEBREAKING_CRITERIA } from '../models/constants';
import { TiebreakingCriterion } from '../models/equipo';
import { DataService } from '../services/data.service';
import { TranslatorService } from '../services/translator.service';

@Component({
  selector: 'app-tiebreaking-criteria',
  templateUrl: './tiebreaking-criteria.page.html',
  styleUrls: ['./tiebreaking-criteria.page.scss'],
})
/**
 * TiebreakingCriteriaPage is the page that contains the user functionality of chosing which
 * tiebreaking criteria are going to be used, and the priority among them
 */
export class TiebreakingCriteriaPage implements OnInit {

  tiebreakingCSub: Subscription;
  tiebreaking_criteria: TiebreakingCriterion[];
  
  // List with TiebreakingCriterion or separators, so we can have multiple lists inside the UI list
  tiebreaking_list: TiebreakingListElement[];

  constructor(private translator: TranslatorService, private dataService: DataService) {
    this.tiebreaking_criteria = DEFAULT_TIEBREAKING_CRITERIA;
    this.fillTiebreakingList();
  }

  ngOnInit() {
    this.tiebreakingCSub = this.dataService.tiebreaking_criteria_UI.subscribe((valor)=>{
      this.tiebreaking_criteria = valor;
      this.fillTiebreakingList();
    });
  }

  ionViewWillLeave() {
    this.tiebreakingCSub.unsubscribe();
    this.saveCriteria();
  }

  /**
   * Fill the tiebreaking_list UI list using the data from the tiebreaking_criteria
   */
  fillTiebreakingList() {
    this.tiebreaking_list = [];
    for(let crit of this.tiebreaking_criteria) {
      this.tiebreaking_list.push(new TiebreakingListElement(crit));
    }
    this.tiebreaking_list.push(new TiebreakingListElement(undefined, TiebreakingListSeparatorType.DISABLED_CRITERIA));
    for(let origCrit of ALL_TIEBREAKING_CRITERIA) {
      if (!this.tiebreaking_criteria.includes(origCrit)) {
        this.tiebreaking_list.push(new TiebreakingListElement(origCrit));
      }
    }
  }

  /**
   * Fill the tiebreaking_criteria list using the data from the tiebreaking_list UI list
   */
  fillTiebreakingCriteria() {
    this.tiebreaking_criteria = [];
    for(let critItem of this.tiebreaking_list) {
      if (critItem.isCriterion()) {
        this.tiebreaking_criteria.push(critItem.getCriterion());
      } else {
        return;
      }
    }
  }

  saveCriteria() {
    this.dataService.setTiebreakingCriteriaUI(this.tiebreaking_criteria);
  }

  getNameOfCriterion(criterion: TiebreakingCriterion): string {
    switch(criterion) {
      case TiebreakingCriterion.FALTAS:
        return 'criterion_faults';
      case TiebreakingCriterion.GOLAVERAGE:
        return 'criterion_golaverage';
      case TiebreakingCriterion.ENFRENTAMIENTOSAGAINST:
        return 'criterion_enfrentamientos_against';
      case TiebreakingCriterion.BUCHHOLZ:
        return 'criterion_buchholz';
      case TiebreakingCriterion.MEDIANBUCHHOLZ:
        return 'criterion_median_buchholz';
      default:
        return '';
    }
  }

  doReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. Update the items variable to the
    // new order of items
    this.tiebreaking_list = ev.detail.complete(this.tiebreaking_list);
    this.fillTiebreakingCriteria();
  }

}

/**
 * Element of the UI list that can be a criterion or a separator.
 * Useful for simulate multiple lists inside of a list
 */
class TiebreakingListElement {

  private criterion: TiebreakingCriterion;
  private separatorType: TiebreakingListSeparatorType;

  constructor(criterion: TiebreakingCriterion, separatorType?: TiebreakingListSeparatorType){
    this.criterion = criterion;
    if (this.criterion == undefined) {
      this.separatorType = separatorType;
    }
  }

  isCriterion(): boolean {
    return this.criterion != undefined;
  }

  isSeparator(): boolean {
    return this.criterion == undefined;
  }

  getCriterion(): TiebreakingCriterion {
    return this.criterion;
  }

  getSeparator(): TiebreakingListSeparatorType {
    return this.separatorType;
  }

  getSeparatorString(): string {
    switch(this.separatorType) {
      case TiebreakingListSeparatorType.DISABLED_CRITERIA:
        return 'tiebreaking_criteria_disabled';
      default:
        return '';
    }
  }

}

enum TiebreakingListSeparatorType {
  DISABLED_CRITERIA
}
