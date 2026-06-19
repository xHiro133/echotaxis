import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ApiConfig } from "../config/api.config";

@Injectable({ providedIn: 'root' })
export class ApiService {

    private _useMocks = true;

    constructor(private _apiConfig: ApiConfig) {}

    example(body: any): Observable<{ authenticated: boolean }> {
        if (this._useMocks) {
            return of({ authenticated: true });
        }

        return this._apiConfig.send('example', body);
    }

}