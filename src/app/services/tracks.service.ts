import { Injectable } from "@angular/core";
import { ApiConfig } from "../config/api.config";
import { Algorithms } from "../models/track.model";

@Injectable({ providedIn: 'root' })
export class TracksService {

    constructor(private _apiConfig: ApiConfig) {}

    sendTracks(tracks: { guide: File; dub: File}, sampleRates: { guide: number; dub: number }, algorithm: Algorithms) {
        const formData = new FormData();

        formData.append('guide', tracks.guide);
        formData.append('dub', tracks.dub);

        formData.append('guideSampleRate', String(sampleRates.guide));
        formData.append('dubSampleRate', String(sampleRates.dub));

        formData.append('algorithm', String(algorithm));

        return this._apiConfig.send('sendTracksData', { body: formData } );
    }

}