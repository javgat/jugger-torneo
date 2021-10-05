import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EquipoEnfrentamientosPageRoutingModule } from './equipo-enfrentamientos-routing.module';

import { EquipoEnfrentamientosPage } from './equipo-enfrentamientos.page';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MatchHappenedComponentModule } from '../children/match-happened/match-happened.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    IonicModule,
    MatchHappenedComponentModule,
    EquipoEnfrentamientosPageRoutingModule
  ],
  declarations: [EquipoEnfrentamientosPage]
})
export class EquipoEnfrentamientosPageModule {}
