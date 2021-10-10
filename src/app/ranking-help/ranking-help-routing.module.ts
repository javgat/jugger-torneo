import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RankingHelpPage } from './ranking-help.page';

const routes: Routes = [
  {
    path: '',
    component: RankingHelpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RankingHelpPageRoutingModule {}
