export enum Themes {
    LIGHT = 'light',
    DARK = 'dark'
};

export interface Theme {
    primary: string;
    secondary: string;
    accent: string;
    "accent-dark": string;
    light: string;
    dark: string;
    background: string;
}