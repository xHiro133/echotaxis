import { Component, EventEmitter } from "@angular/core";
import { TrackComponent } from "../../shared/track/track.component";
import { ControlType, MyForm } from "../../models/form.model";
import { FormComponent } from "../../shared/form/form.component";
import { TranslatePipe } from "../../pipes/translate.pipe";
import { TracksService } from "../../services/tracks.service";
import { LoaderService } from "../../services/loader.service";
import { UtilsService } from "../../services/utils.service";

@Component({
    selector: 'my-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [TrackComponent, FormComponent, TranslatePipe]
})
export class HomeComponent {

    pauseGuide = new EventEmitter<void>();
    pauseDub = new EventEmitter<void>();
    pauseResult = new EventEmitter<void>();

    setResult = new EventEmitter<File>();

    globalVolume = 100;

    form: MyForm = {
        controls: [
            { selector: 'globalVolume', type: ControlType.CHECKBOX, options: [{ value: 'GV', label: 'home.globalVolume' }], defaultValue: this._getDefaultForm().globalVolume }
        ]
    };

    tracksData: {
        guide?: File,
        dub?: File
    } = {};

    constructor(private _tracksService: TracksService, private _loaderService: LoaderService, private _utilsService: UtilsService) {}

    canGenerate() {
        return !!this.tracksData.guide && !!this.tracksData.dub;
    }

    generateTrack() {
        if (!this.canGenerate()) {
            return;
        }

        this._loaderService.show();

        this._tracksService.sendTracks(this.tracksData as { guide: File, dub: File }).subscribe({
            next: (result) => {
                this._loaderService.hide();

                const file = this._utilsService.fileDataToFile(result.fileData);

                this.setResult.emit(file);
            },
            error: (err) => {
                this._loaderService.hide();
            }
        });
    }

    private _getDefaultForm() {
        const defaultForm = {
            globalVolume: 'GV'
        };

        return {
            globalVolume: JSON.parse(localStorage.getItem('formValue') || defaultForm.globalVolume)?.globalVolume || ''
        };
    }

    setDefaultForm() {
        localStorage.setItem('formValue', JSON.stringify(this.form.value));
    }

    saveTrackData(track: 'guide' | 'dub', file: File) {
        this.tracksData[track] = file;
    }

    setGlobalVolume(volume: number) {
        if (this.form.value?.['globalVolume']) {
            this.globalVolume = volume;
        }
    }

    played(track: 'guide' | 'dub' | 'result') {
        switch (track) {
            case 'guide':
                this.pauseDub.emit();
                this.pauseResult.emit();
                break;
            case 'dub':
                this.pauseGuide.emit();
                this.pauseResult.emit();
                break;
            case 'result':
                this.pauseGuide.emit();
                this.pauseDub.emit();
                break;
        }
    }

}