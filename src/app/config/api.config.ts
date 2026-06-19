import { Injectable } from "@angular/core";
import { ConfigService } from "../services/config.service";
import { Api, ApiOptions } from "../models/api.model";
import { delay, Observable, switchMap, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class ApiConfig {

    baseUrl: string = '';
    apiEndpoints: Api[] = [];

    constructor (private _configService: ConfigService, private _http: HttpClient) {}

    getApi(selector: string): Api | undefined {
        return this.apiEndpoints
            .map(apis => ({ selector: apis.selector, url: this.baseUrl + apis.url, method: apis.method, delay: apis.delay }))
            .find(api => api.selector === selector);
    }

    send(selector: string, options?: ApiOptions): Observable<any> {
        return this._configService.getAppConfig().pipe(
            switchMap((appConfig) => {
                this.baseUrl = appConfig.baseUrl;
                return this._configService.getApiConfig()
            }),
            switchMap((apiConfig) => {
                this.apiEndpoints = apiConfig;

                const api = this.getApi(selector);

                if (!api) {
                    return throwError(() => new Error(`API not found for selector: ${selector}`));
                }

                if (api.method === 'GET') {
                    const patchedUrl = this._patchParams(api.url, options?.params, options?.queryParams);
                    return this._http.get(patchedUrl, { headers: options?.headers }).pipe(delay(api.delay || 0));
                }

                if (api.method === 'POST') {
                    const patchedUrl = this._patchParams(api.url, options?.params, options?.queryParams);
                    return this._http.post(patchedUrl, options?.body, { headers: options?.headers }).pipe(delay(api.delay || 0));
                }

                throw new Error(`Method ${api.method} not implemented yet`);
            })
        );
    }

    private _patchParams(url: string, params?: { [key: string]: string | string[] }, queryParams?: { [key: string]: string | string[] }): string {
        let processedUrl = url;

        Object.keys(params || {}).forEach(key => {
            const placeholder = `{${key}}`;
            const value = String(params![key]);
            processedUrl = processedUrl.replaceAll(placeholder, value);
        });

        Object.keys(queryParams || {}).forEach(key => {
            const placeholder = `[${key}]`;
            const value = String(queryParams![key]);
            processedUrl = processedUrl.replaceAll(placeholder, value);
        });

        return processedUrl;
    }

}