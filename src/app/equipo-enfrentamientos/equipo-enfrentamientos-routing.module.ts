import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EquipoEnfrentamientosPage } from './equipo-enfrentamientos.page';

const routes: Routes = [
  {
    path: '',
    component: EquipoEnfrentamientosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipoEnfrentamientosPageRoutingModule {}
