import { Injectable } from "@angular/core";
import { ApiConfig } from "../config/api.config";

@Injectable({ providedIn: 'root' })
export class TracksService {

    constructor(private _apiConfig: ApiConfig) {}

    sendTracks(tracks: { guide: File; dub: File}) {
        const formData = new FormData();

        formData.append('guide', tracks.guide);
        formData.append('dub', tracks.dub);

        return this._apiConfig.send('sendTracksData', { body: formData });
    }

}