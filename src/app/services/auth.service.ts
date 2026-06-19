import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({ providedIn: 'root' })
export class AuthService {

    authenticated = false;

    constructor(private _apiService: ApiService) {}

}