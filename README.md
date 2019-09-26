# LOGO ANGULAR KIT

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.6.

- npm set registry https://dregistry.logo.com.tr/repository/npm-logofe/
- npm set registry https://dregistry.logo.com.tr/repository/npm-logfe-group/
- npm set registry https://registry.npmjs.org/

#### Generate Library
Using `ng g library NameOfLibrary(@logo-software/excel)` command can create a new library on the console screen.

#### Pre Publishing Library
Sometimes, some repositories need other dependencies like `moment`. Before publishing this kind of repositories must set `whitelistedNonPeerDependencies` properties of `ng-package.json` file at the root of the library. For example:

````json
{
  "$schema": "../../../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../../dist/logo/excel",
  "lib": {
    "entryFile": "src/public_api.ts"
  },
  "whitelistedNonPeerDependencies": [
    "moment",
    "file-saver",
    "xmlbuilder"
  ]
}

````

#### Publishing Library
There are 4 steps for publish library:
  - On console screen run `ng build @logo-software/excel` command. It will build project folder under the `dist` folder
  - Change directory path to `cd dist/logo/excel` on console screen
  - Before publish set npm registry to Logo Nexus Repository Manager using `npm set registry https://dregistry.logo.com.tr/repository/npm-logofe/` command
  - Run `npm publish`
  
Alternative repositories:

- npm set registry https://dregistry.logo.com.tr/repository/npm-group/
- npm set registry https://dregistry.logo.com.tr/repository/npm-logofe/
- npm set registry https://dregistry.logo.com.tr/repository/npm-logfe-group/
- npm set registry https://registry.npmjs.org/
- npm get registry

Nexus Repository Manager Links:

- http://nexus.logo.com.tr
- http://nexus2.logo.com.tr:8081
- https://dregistry.logo.com.tr/

# 1. Excel Module

Given data or any service returned data can be exportable with this component to Excel

- **@Input() data: any** - Will be displayed data source
- **@Input() columns:  TableColumns[]** - Definitions of the columns and variables will be displayed
- **@Input() header: string[] -** Excel column header names (optional). If not set, columns display text will be set as a header.
- **@Input() name: string[] -** Exported file name
- **@Input() status: boolean -** The default value is true. If it set to false, excel export will not be triggered.
- **@Input() service: RequestOptions -** If set, the data will be requested from RESTful API address.
- **@Output() complete: Function -** It will be triggered when data received and before de export.

### Example Usage
````angular2html
<excel
(complete)="excelComplete()"
[data]="excelSample.data"
[columns]="excelSample.column"
[header]="excelSample.header"
[name]="excelSample.fileName"
>
</excel>
````
### Data Sample
````typescript
const excelSample = {
  fileName: 'ExcelFile',
  header: ['CODE', 'ADDRESS', 'NAME', 'SURNAME'],
  column: [
    {
      display: 'ID',
      variablePath: 'id',
      hidden: true
    },
    {
      display: 'Code',
      variablePath: 'code',
    },
    {
      display: 'Address',
      variablePath: 'zone.address',
    },
    {
      display: 'Name',
      variablePath: 'user.name',
    },
    {
      display: 'Surname',
      variablePath: 'user.surname',
    }
  ],
  data: [
    {id: 1, code: 123213, zone: {address: 'Doğruluk sok. 8/10 Ankara'}, user: {name: 'Serkan', surname: 'Konakcı'}},
    {id: 2, code: 2134, zone: {address: 'Ateş sok. 3/5 İstanbul'}, user: {name: 'Seda', surname: 'Sayan'}},
    {id: 3, code: 456456, zone: {address: 'Kıvılcım apt. 5/23 Konya'}, user: {name: 'Banu', surname: 'Alkan'}},
  ]
};
````


### 2. Language Module

With this module you can easly translate any text to specified language on the fly. 

#### Installation
There are three steps:

 - Install package using `npm install @logo-software/language` 
 - add it to your AppModule imports code block using `LanguageModule.forRoot(languageConf)`
 - Put your language files to your `assets/languages` folder (assets/language/en-En.json etc.). 

#### Configuration

Default language is "en". You can also change language to "tr". There are some options for customization:

**abbr**: is your page language, if you want to set default language to en | tr

**readFromFile**: is default **false**,  and if you set true this option import en-En.json file statically from path without http request. Otherwise it will include language file over http protocol. 
 
**NOTE** If `readFromFile` is **true**, assetPath must be `/assets/languages`

**assetPath**: is the path of the language files. Default path is `/assets/languages`. When **readFromFile** is **true**, you must put your language files under your `src/assets/languages` folder. If **readFromFile** is **false**, you can set your language files where you want then set **assetsPath** to these files paths.

**extensition**: is the file extension will be download. Default is **json**.
  

#### Usage Example

Just as below you can easily set you application's language.
 
<sub>**app.module.ts**</sub>
```typescript
import {LanguageInitSetting, LanguageModule} from '@logo-software/language';


const languageConf: LanguageInitSetting = {abbr: 'en', readFromFile: false, extension: 'json'};
const EXTERNAL_MODULES = [LanguageModule.forRoot(languageConf)];

@NgModule({
  declarations: [AppComponent],
  imports: [EXTERNAL_MODULES],
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
import {LanguageService} from '@logo-software/language';

@Component({
  selector: 'lbs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'logo-ng-library';

  constructor(private languageService: LanguageService) {
    this.addLanguage();
  }
  
  // change application language to tr
  setLanguage(lang: string = 'tr') {
    this.languageService.setLanguage(lang);
  }
  
  // adds new language to app
  addLanguage() {
    this.languageService.addLanguage({abbr: 'ro', code: 'ro-RO', display: 'Romain'});
  }
}
```

**Add Language**

If you desire, There are not enough language exist for me then you can add more languages to your scope. First add your language file to **assetsPath** (For example: `/src/assets/languages`). After that call newly created language definition from  code. Example usage:

```typescript
this.languageService.addLanguage({abbr: 'ro', code: 'ro-RO', display: 'Romain'});
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

##### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

##### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

##### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

##### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

##### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
