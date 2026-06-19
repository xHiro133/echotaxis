import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, of, tap } from "rxjs";
import { Language, LanguageCode } from "../models/language.model";

@Injectable({ providedIn: 'root' })
export class TranslateService {

    private _currentLanguageCode: LanguageCode = this._getCurrentLanguageFromLocalStorage();    
    private _currentLanguage?: Language;

    constructor(private _http: HttpClient) {}

    translate(msg: string): string {
        return this._translate(msg?.split('.'), 0, this._currentLanguage?.data);
    }

    private _translate(msg: string[], index: number, data: any): string {
        if (!data?.[msg?.[index]]) {
            return msg?.join('.');
        }

        if (typeof data[msg?.[index]] === 'string') {
            return data[msg?.[index]];
        }

        return this._translate(msg, index + 1, data[msg?.[index]]);
    }

    getCurrentLanguageCode(): LanguageCode {
        return this._currentLanguageCode;
    }

    getCurrentLanguage(): Observable<Language> {
        if (this._currentLanguage) {
            return of(this._currentLanguage);
        }

        return this._getLanguage(this._currentLanguageCode).pipe(tap((res) => {
            this._currentLanguage = { code: this._currentLanguageCode, data: res };
        }));
    }

    setLanguage(langCode: LanguageCode): Observable<Language> {
        return this._getLanguage(langCode).pipe(map((res) => {
            localStorage.setItem('language', langCode);

            this._currentLanguageCode = langCode;
            this._currentLanguage = { code: this._currentLanguageCode, data: res };

            return this._currentLanguage;
        }));
    }

    private _getCurrentLanguageFromLocalStorage(): LanguageCode {
        if (localStorage.getItem('language')) {
            return (localStorage.getItem('language')!) as LanguageCode;
        }

        const browserLanguages = (navigator.languages ?? [navigator.language]).filter(l => !l.includes('-'));
        const supported = Object.values(LanguageCode);

        for (const lang of browserLanguages) {
            if (supported.includes(lang as LanguageCode)) {
                return lang as LanguageCode;
            }
        }

        return LanguageCode.ITALIAN;
    }

    private _getLanguage(langCode: LanguageCode): Observable<any> {
        return this._http.get(`/assets/languages/${langCode}.json`);
    }

}