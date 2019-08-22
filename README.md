# LogoNgLibrary

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.6.

## Generate Library
Using `ng g library NameOfLibrary(@logo/excel)` command can create a new library on the console screen.

## Pre Publishing Library
Some repositories need other dependencies like `moment`. Before publishing this kind of repositories must be added `whitelistedNonPeerDependencies` properties of `ng-package.json` file at the root of the library. For example:

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

## Publishing Library
There are 4 steps for publish library:
  - On console screen run `ng build @logo/excel` command. It will build project folder under the `dist` folder
  - Change directory path to `cd dist/logo/excel` on console screen
  - Before publish set npm registry to Logo Nexus Repository Manager using `npm set registry https://dregistry.logo.com.tr/repository/npm-logofe/` command
  - Run `npm publish`
  
Alternative repositories:

- npm set registry https://dregistry.logo.com.tr/repository/npm-group/
- npm set registry https://dregistry.logo.com.tr/repository/npm-logofe/
- npm set registry https://dregistry.logo.com.tr/repository/npm-logfe-group/
- npm set registry https://registry.npmjs.org/

Nexus Repository Manager Links:

- http://nexus.logo.com.tr
- http://nexus2.logo.com.tr:8081
- https://dregistry.logo.com.tr/

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
