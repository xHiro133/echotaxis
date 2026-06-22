import { Component, EventEmitter } from "@angular/core";
import { TrackComponent } from "../../shared/track/track.component";
import { ControlType, MyForm } from "../../models/form.model";
import { FormComponent } from "../../shared/form/form.component";

@Component({
    selector: 'my-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [TrackComponent, FormComponent]
})
export class HomeComponent {

    pauseBase = new EventEmitter<void>();
    pauseSample = new EventEmitter<void>();
    pauseResult = new EventEmitter<void>();

    globalVolume = 100;

    form: MyForm = {
        controls: [
            { selector: 'globalVolume', type: ControlType.CHECKBOX, options: [{ value: 'GV', label: 'home.globalVolume' }], defaultValue: this._getDefaultForm().globalVolume }
        ]
    };

    constructor() {}

    private _getDefaultForm() {
        return {
            globalVolume: JSON.parse(localStorage.getItem('formValue') || '{}')?.globalVolume || ''
        };
    }

    setDefaultForm() {
        localStorage.setItem('formValue', JSON.stringify(this.form.value));
    }

    setGlobalVolume(volume: number) {
        if (this.form.value?.['globalVolume']) {
            this.globalVolume = volume;
        }
    }

    played(track: 'base' | 'sample' | 'result') {
        switch (track) {
            case 'base':
                this.pauseSample.emit();
                this.pauseResult.emit();
                break;
            case 'sample':
                this.pauseBase.emit();
                this.pauseResult.emit();
                break;
            case 'result':
                this.pauseSample.emit();
                this.pauseSample.emit();
                break;
        }
    }

}