export enum LanguageCode {
    ITALIAN = 'it',
    ENGLISH = 'en'
}

export interface Language {
    code: LanguageCode;
    data: any;
}