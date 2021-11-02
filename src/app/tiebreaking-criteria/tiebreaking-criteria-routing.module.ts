import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TiebreakingCriteriaPage } from './tiebreaking-criteria.page';

const routes: Routes = [
  {
    path: '',
    component: TiebreakingCriteriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TiebreakingCriteriaPageRoutingModule {}
