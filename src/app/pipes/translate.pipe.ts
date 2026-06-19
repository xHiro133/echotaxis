import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../services/translate.service';

@Pipe({
  name: 'translate',
  standalone: true
})
export class TranslatePipe implements PipeTransform {

  constructor(private _translateService: TranslateService) {}

  transform(key: string): string {
    return this._translateService.translate(key) as string;
  }

}
