/*
 * @license
 * Copyright LOGO YAZILIM SANAYİ VE TİCARET A.Ş. All Rights Reserved.
 *
 * Save to the extent permitted by law, you may not use, copy, modify,
 * distribute or create derivative works of this material or any part
 * of it without the prior written consent of LOGO YAZILIM SANAYİ VE TİCARET A.Ş. Limited.
 * Any reproduction of this material must contain this notice.
 */

export class Language {
  code: string;
  display: string;
  abbr: string;
}

export class LanguageInitSetting {
  abbr: string;
  path?: string;
  readFromFile?: boolean;
  extension?: string;
}
