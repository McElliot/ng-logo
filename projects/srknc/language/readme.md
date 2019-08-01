### Language Module Usage

With this module you can easly translate any text to specified language on the fly. You just need import LanguageModule to your code base. Then set module language to your page language. Default language is "en". You can also change language to "tr". There are some options for customization:

**abbr**: is your page language, if you want to set default language to en | tr

**readFromFile**: is default **false**,  and if you set true this option call en-En.json file statically. Otherwise it will include language file over http protocol.

**assetPath**: is the path of the language files. Default path is `/assets/languages`. When **readFromFile** is **true**, you must put your language files under your `src/assets/languages` folder. If **readFromFile** is **false**, you can set your language files where you want then set **assetsPath** to these files paths.  
  

####Usage Example

Just as below you can easily set you application's language.
 
<sub>**app.module.ts**</sub>
```typescript
import LanguageModule from "@srknc/language";

const languageConf: LanguageConfiguration = {abbr: 'en', readFromFile: false};
const MODULES = [LanguageModule.forRoot(languageConf)];

@NgModule({
  declarations: [AppComponent],
  imports: [MODULES, BrowserModule, BrowserAnimationsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

```

**Change Language**

If you decide to use multiple language and change it using button to another one, just paste below sample to your code base.

```typescript
import {Component} from '@angular/core';
import {LanguageService} from '@srknc/language.service';

@Component({
  selector: 'lbs-root',
  template:`
    <h1>Set Language</h1>
    <div>{{'login-info' | translate}}</div>
    <button (click)="setLanguage('tr')">tr</button>
    <button (click)="setLanguage('en')">en</button>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'logo-ng-library';

  constructor(private languageService: LanguageService) {
  }

  setLanguage(lang: string = 'tr') {
    this.languageService.setLanguage(lang);
  }
}

```

**Add Language**

If you desire, There are not enough language exist for me then you can add more languages to your scope. First add your language file to **assetsPath** (For example: `/src/assets/language`). After that call newly created language definition from  code. Example usage:

```typescript

```
