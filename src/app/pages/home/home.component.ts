import { Component, EventEmitter, HostListener } from "@angular/core";
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

    actionGuide = new EventEmitter<'toggle' | 'on' | 'off' | 'stop' | 'mute' | 'action' | 'skip' | 'rewind'>();
    actionDub = new EventEmitter<'toggle' | 'on' | 'off' | 'stop' | 'mute' | 'action' | 'skip' | 'rewind'>();
    actionResult = new EventEmitter<'toggle' | 'on' | 'off' | 'stop' | 'mute' | 'action' | 'skip' | 'rewind'>();

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

    lastTrack?: 'guide' | 'dub' | 'result';

    constructor(private _tracksService: TracksService, private _loaderService: LoaderService, private _utilsService: UtilsService) {}

    @HostListener('window:keydown', ['$event'])
    toggleTrack(event: KeyboardEvent) {
        event.preventDefault();

        if (event.key === ' ') {
            switch(this.lastTrack) {
                case 'guide':
                    this.actionGuide.emit('toggle');
                    break;
                case 'dub':
                    this.actionDub.emit('toggle');
                    break;
                case 'result':
                    this.actionResult.emit('toggle');
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
            this.lastTrack = 'result';
        }

        if (event.key === 's') {
            switch(this.lastTrack) {
                case 'guide':
                    this.actionGuide.emit('stop');
                    break;
                case 'dub':
                    this.actionDub.emit('stop');
                    break;
                case 'result':
                    this.actionResult.emit('stop');
                    break;
            }
        }

        if (event.key === 'm') {
            switch(this.lastTrack) {
                case 'guide':
                    this.actionGuide.emit('mute');
                    break;
                case 'dub':
                    this.actionDub.emit('mute');
                    break;
                case 'result':
                    this.actionResult.emit('mute');
                    break;
            }
        }

        if (event.key === 'd') {
            switch(this.lastTrack) {
                case 'guide':
                    this.actionGuide.emit('action');
                    break;
                case 'dub':
                    this.actionDub.emit('action');
                    break;
                case 'result':
                    this.actionResult.emit('action');
                    break;
            }
        }

        if (event.key === 'ArrowRight') {
            switch(this.lastTrack) {
                case 'guide':
                    this.actionGuide.emit('skip');
                    break;
                case 'dub':
                    this.actionDub.emit('skip');
                    break;
                case 'result':
                    this.actionResult.emit('skip');
                    break;
            }
        }

        if (event.key === 'ArrowLeft') {
            switch(this.lastTrack) {
                case 'guide':
                    this.actionGuide.emit('rewind');
                    break;
                case 'dub':
                    this.actionDub.emit('rewind');
                    break;
                case 'result':
                    this.actionResult.emit('rewind');
                    break;
            }
        }
    }

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
                
                this.lastTrack = 'result';
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
        this.lastTrack = track;
    }

    setGlobalVolume(volume: number) {
        if (this.form.value?.['globalVolume']) {
            this.globalVolume = volume;
        }
    }

    played(track: 'guide' | 'dub' | 'result') {
        this.lastTrack = track;

        switch (track) {
            case 'guide':
                this.actionDub.emit('off');
                this.actionResult.emit('off');
                break;
            case 'dub':
                this.actionGuide.emit('off');
                this.actionResult.emit('off');
                break;
            case 'result':
                this.actionGuide.emit('off');
                this.actionDub.emit('off');
                break;
        }
    }

}