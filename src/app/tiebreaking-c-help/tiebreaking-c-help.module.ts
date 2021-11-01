import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TiebreakingCHelpPageRoutingModule } from './tiebreaking-c-help-routing.module';

import { TiebreakingCHelpPage } from './tiebreaking-c-help.page';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

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
    TiebreakingCHelpPageRoutingModule
  ],
  declarations: [TiebreakingCHelpPage]
})
export class TiebreakingCHelpPageModule {}
