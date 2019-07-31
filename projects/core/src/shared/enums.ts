import {Language} from '~/shared/services/language/language.service';

export enum STORAGE_TYPES {
  LOCAL = 'localStorage',
  SESSION = 'sessionStorage'
}

export enum HTTP_METHODS {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  CONNECT = 'CONNECT',
  OPTIONS = 'OPTIONS',
  TRACE = 'TRACE',
  PATCH = 'PATCH'
}

export enum MotionType {
  LEFT = 'left',
  RIGHT = 'right',
  WILDCARD = 'wildcard'
}

export const languages: Language[] = [
  {abbr: 'en', code: 'en-EN', display: 'English'},
  {abbr: 'tr', code: 'tr-TR', display: 'Türkçe'},
];

export class MessageTypes {
  public static ERROR = 'error';
  public static SUCCESS = 'success';
  public static WARNING = 'warning';
  public static INFORMATION = 'information';
}
