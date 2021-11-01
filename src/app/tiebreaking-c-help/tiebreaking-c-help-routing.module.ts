import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TiebreakingCHelpPage } from './tiebreaking-c-help.page';

const routes: Routes = [
  {
    path: '',
    component: TiebreakingCHelpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TiebreakingCHelpPageRoutingModule {}
