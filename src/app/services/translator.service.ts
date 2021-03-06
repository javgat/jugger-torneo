import { Injectable } from '@angular/core';
import { Globalization } from '@ionic-native/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * TranslatorService implements the translating functionality, translating keys to the adequate string
 */
export class TranslatorService {

  public language: string;

  constructor(private globalization: Globalization, private _translate: TranslateService) {
    this.getDeviceLanguage();
  }

  public translate(key: string): Observable<string>{
    return this._translate.get(key);
  }

  private _initTranslate(language: string) {
    // Set the default language for translation strings, and the current language.
    this._translate.setDefaultLang('en');
    if (language) {
      this.language = language.substr(0,2);
    } else {
      // Set your language here
      this.language = 'en';
    }
    this._translate.use(this.language);
  }

  private getDeviceLanguage() {
    if (window.Intl && typeof window.Intl === 'object') {
      this._initTranslate(navigator.language)
    }
    else {
      this.globalization.getPreferredLanguage()
        .then(res => {
          this._initTranslate(res.value)
        })
        .catch(e => {console.log(e);});
    }
  }
}
