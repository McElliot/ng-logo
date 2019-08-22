/*
 * @license
 * Copyright LOGO YAZILIM SANAYİ VE TİCARET A.Ş. All Rights Reserved.
 *
 * Save to the extent permitted by law, you may not use, copy, modify,
 * distribute or create derivative works of this material or any part
 * of it without the prior written consent of LOGO YAZILIM SANAYİ VE TİCARET A.Ş. Limited.
 * Any reproduction of this material must contain this notice.
 */

import {Pipe, PipeTransform} from '@angular/core';
import {LanguageService} from './language.service';

/**
 * Usage example:
 * <p>{{result.message || "vehicle_unload_delivery" | translate:[barcode]}}</p>
 *
 * in language json file (tr.langugage.ts)
 * vehicle_unload_delivery: '{0} numaralı gönderi araçtan indirilmiştir'
 */
@Pipe({
  name: 'translate',
  pure: false
})
export class LanguagePipe implements PipeTransform {
  constructor(private language: LanguageService) {
  }

  transform(value: string, params?: any): string {
    return this.language.translate(value, params);
  }
}
