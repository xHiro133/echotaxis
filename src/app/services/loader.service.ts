import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class LoaderService {

    private _loaderQueue: string[] = [];

    constructor() {}

    getQueue() {
        return [...this._loaderQueue];
    }

    show(subject?: string) {
        this._loaderQueue.push(subject || 'unknown');
    }

    hide(subject?: string) {
        const index = this._loaderQueue.indexOf(subject || 'unknown');
        this._loaderQueue.splice(index, 1);
    }

}