import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, tap } from "rxjs";
import { Api } from "../models/api.model";
import { Config } from "../models/config.model";
import { Feature } from "../models/feature.model";
import { Theme } from "../models/themes.model";

@Injectable({ providedIn: 'root' })
export class ConfigService {

    private _configs: { [key: string]: Config } = {};

    constructor(private _http: HttpClient) { }

    getAppConfig(): Observable<any> {
        return this._getConfig<any>('app');
    }

    getApiConfig(): Observable<Api[]> {
        return this._getConfig<Api[]>('api');
    }

    getFeaturesConfig(): Observable<Feature[]> {
        return this._getConfig<Feature[]>('features');
    }

    getThemesConfig(): Observable<{ [key: string]: Theme }> {
        return this._getConfig<{ [key: string]: Theme }>('themes');
    }

    private _getConfig<T>(config: string): Observable<T> {
        if (!this._configs[config]) {
            this._configs[config] = { loading: true };
        }

        if (!this._configs[config].loading) {
            return of(this._configs[config].data);
        }

        return this._http.get<T>(`/assets/config/${config}.config.json`).pipe(tap((res) => {
            this._configs[config].loading = false;
            this._configs[config].data = res;
        }));
    }

}