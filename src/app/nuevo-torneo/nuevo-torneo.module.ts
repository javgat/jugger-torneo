import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevoTorneoPageRoutingModule } from './nuevo-torneo-routing.module';

import { NuevoTorneoPage } from './nuevo-torneo.page';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { MatchCreatingComponentModule } from '../children/match-creating/match-creating.module';
import { MatchCreatedComponentModule } from '../children/match-created/match-created.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  imports: [
    IonicModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    CommonModule,
    FormsModule,
    MatchCreatingComponentModule,
    MatchCreatedComponentModule,
    NuevoTorneoPageRoutingModule
  ],
  declarations: [NuevoTorneoPage]
})
export class NuevoTorneoPageModule {}
