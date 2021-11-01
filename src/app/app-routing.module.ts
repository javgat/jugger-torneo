import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./nuevo-torneo/nuevo-torneo.module').then( m => m.NuevoTorneoPageModule)
  },
  {
    path: 'equipo-enfrentamientos/:teamname',
    loadChildren: () => import('./equipo-enfrentamientos/equipo-enfrentamientos.module').then( m => m.EquipoEnfrentamientosPageModule)
  },
  {
    path: 'ranking-help',
    loadChildren: () => import('./ranking-help/ranking-help.module').then( m => m.RankingHelpPageModule)
  },
  {
    path: 'tiebreaking-criteria',
    loadChildren: () => import('./tiebreaking-criteria/tiebreaking-criteria.module').then( m => m.TiebreakingCriteriaPageModule)
  },
  {
    path: 'tiebreaking-c-help',
    loadChildren: () => import('./tiebreaking-c-help/tiebreaking-c-help.module').then( m => m.TiebreakingCHelpPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
