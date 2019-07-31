import {languages, STORAGE_TYPES} from '~/shared/enums';

export const environment: any = {
  localhost: 'localhost',
  remote: 'http://159.65.120.151:8080',
  new: 'http://52.174.6.64:8081/bolt',
  https: 'https://boltinsight.com:8443/bolt',
  development: '192.168.1.30:8080'
};

export const configuration: any = {
  loading: {
    debug: false
  },
  language: {
    files: '/assets/languages',
    default: languages[0],
    extension: 'json'
  },
  storage: STORAGE_TYPES.SESSION,
  // captcha: '6Lemk1YUAAAAANOVl7dRJB8hp1KIk3y6b7D_4TnT',
  // captcha: '6LeUilsUAAAAAMe37HKV88XL0KmXJyhajLjM283T',
  captcha: '6LeXUG8UAAAAAD7Hq54dMoplrxnHgNhea4LMOh5-',
  environment: environment.https,
  home: '/my-pulses',
  fileUploadLimit: 4,
  fileUploadSize: 800,
  imagePath: '/assets/images',
  wait: 3000
};

export enum ROLE {
  OWNER = 'ROLE_OWNER',
  CONTRIBUTOR = 'ROLE_CONTRIBUTOR',
  REPORTER = 'ROLE_REPORTER'
}
