import { Component, EventEmitter, HostListener } from "@angular/core";
import { TrackComponent } from "../../shared/track/track.component";
import { ControlType, MyForm } from "../../models/form.model";
import { FormComponent } from "../../shared/form/form.component";
import { TranslatePipe } from "../../pipes/translate.pipe";
import { TracksService } from "../../services/tracks.service";
import { LoaderService } from "../../services/loader.service";
import { UtilsService } from "../../services/utils.service";
import { TrackActions } from "../../models/track.model";

@Component({
    selector: 'my-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [TrackComponent, FormComponent, TranslatePipe]
})
export class HomeComponent {

    actionGuide = new EventEmitter<TrackActions>();
    actionDub = new EventEmitter<TrackActions>();
    actionOutput = new EventEmitter<TrackActions>();
    redraw: EventEmitter<void> = new EventEmitter<void>();

    setOutput = new EventEmitter<File>();

    globalVolume = 100;

    form: MyForm = {
        controls: [
            { selector: 'globalVolume', type: ControlType.CHECKBOX, options: [{ value: 'GV', label: 'home.globalVolume' }], defaultValue: this._getDefaultForm().globalVolume }
        ]
    };

    tracksData: {
        guide?: { file: File, sampleRate: number },
        dub?: { file: File, sampleRate: number },
        output?: { file: File, sampleRate: number }
    } = {};

    lastTrack?: 'guide' | 'dub' | 'output';

    constructor(private _tracksService: TracksService, private _loaderService: LoaderService, private _utilsService: UtilsService) {}

    @HostListener('window:keydown', ['$event'])
    toggleTrack(event: KeyboardEvent) {
        event.preventDefault();

        if (event.key === ' ') {
            switch(this.lastTrack) {
                case 'guide':
                    this.actionGuide.emit(TrackActions.TOGGLE);
                    break;
                case 'dub':
                    this.actionDub.emit(TrackActions.TOGGLE);
                    break;
                case 'output':
                    this.actionOutput.emit(TrackActions.TOGGLE);
                    break;
            }
        }

        if (event.key === '1') {
            this.lastTrack = 'guide';
        }
        if (event.key === '2') {
            this.lastTrack = 'dub';
        }
        if (event.key === '3') {
            this.lastTrack = 'output';
        }

        if (event.key === 's') {
            switch(this.lastTrack) {
                case 'guide':
                    this.actionGuide.emit(TrackActions.STOP);
                    break;
                case 'dub':
                    this.actionDub.emit(TrackActions.STOP);
                    break;
                case 'output':
                    this.actionOutput.emit(TrackActions.STOP);
                    break;
            }
        }

        if (event.key === 'm') {
            switch(this.lastTrack) {
                case 'guide':
                    this.actionGuide.emit(TrackActions.MUTE);
                    break;
                case 'dub':
                    this.actionDub.emit(TrackActions.MUTE);
                    break;
                case 'output':
                    this.actionOutput.emit(TrackActions.MUTE);
                    break;
            }
        }

        if (event.key === 'd') {
            switch(this.lastTrack) {
                case 'guide':
                    this.actionGuide.emit(TrackActions.ACTION);
                    break;
                case 'dub':
                    this.actionDub.emit(TrackActions.ACTION);
                    break;
                case 'output':
                    this.actionOutput.emit(TrackActions.ACTION);
                    break;
            }
        }

        if (event.key === 'ArrowRight') {
            switch(this.lastTrack) {
                case 'guide':
                    this.actionGuide.emit(TrackActions.SKIP);
                    break;
                case 'dub':
                    this.actionDub.emit(TrackActions.SKIP);
                    break;
                case 'output':
                    this.actionOutput.emit(TrackActions.SKIP);
                    break;
            }
        }

        if (event.key === 'ArrowLeft') {
            switch(this.lastTrack) {
                case 'guide':
                    this.actionGuide.emit(TrackActions.REWIND);
                    break;
                case 'dub':
                    this.actionDub.emit(TrackActions.REWIND);
                    break;
                case 'output':
                    this.actionOutput.emit(TrackActions.REWIND);
                    break;
            }
        }

        if (event.key === 't') {
            switch(this.lastTrack) {
                case 'guide':
                    this.actionGuide.emit(TrackActions.TEST);
                    break;
                case 'dub':
                    this.actionDub.emit(TrackActions.OFF);
                    break;
                case 'output':
                    this.actionOutput.emit(TrackActions.TEST);
                    break;
            }
        }
    }

    canGenerate() {
        return !!this.tracksData.guide && !!this.tracksData.dub;
    }

    canTest() {
        return !!this.tracksData.guide && !!this.tracksData.output;
    }

    generateTrack() {
        if (!this.canGenerate()) {
            return;
        }

        this._loaderService.show();

        const body = { guide: this.tracksData.guide!.file, dub: this.tracksData.dub!.file };
        const sampleRates = { guide: this.tracksData.guide!.sampleRate, dub: this.tracksData.dub!.sampleRate };

        this._tracksService.sendTracks(body, sampleRates).subscribe({
            next: (res) => {
                this._loaderService.hide();

                const file = this._utilsService.fileDataToFile(res.fileData);

                this.setOutput.emit(file);

                this.lastTrack = 'output';
            },
            error: (err) => {
                this._loaderService.hide();
            }
        });
    }

    testTracks() {
        if (!this.canTest()) {
            return;
        }

        this.actionGuide.emit(TrackActions.TEST);
        this.actionDub.emit(TrackActions.OFF);
        this.actionOutput.emit(TrackActions.TEST);
    }

    resizeTracks() {
        this.redraw.emit();
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

    saveTrackData(track: 'guide' | 'dub' | 'output', data: { file: File, sampleRate: number }) {
        this.tracksData[track] = { file: data.file, sampleRate: data.sampleRate };
        this.lastTrack = track;
    }

    setGlobalVolume(volume: number) {
        if (this.form.value?.['globalVolume']) {
            this.globalVolume = volume;
        }
    }

    played(track: 'guide' | 'dub' | 'output') {
        this.lastTrack = track;

        switch (track) {
            case 'guide':
                this.actionDub.emit(TrackActions.OFF);
                this.actionOutput.emit(TrackActions.OFF);
                break;
            case 'dub':
                this.actionGuide.emit(TrackActions.OFF);
                this.actionOutput.emit(TrackActions.OFF);
                break;
            case 'output':
                this.actionGuide.emit(TrackActions.OFF);
                this.actionDub.emit(TrackActions.OFF);
                break;
        }
    }

}