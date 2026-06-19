import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Control, ControlType, MyForm } from "../../models/form.model";
import { NgTemplateOutlet } from "@angular/common";
import { TranslatePipe } from "../../pipes/translate.pipe";

@Component({
    selector: 'my-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    standalone: true,
    imports: [NgTemplateOutlet, TranslatePipe]
})
export class FormComponent implements AfterViewInit, OnInit {

    @Input('form') form?: MyForm;

    @Output() formChanged: EventEmitter<MyForm> = new EventEmitter();

    checkboxValues: string[] = [];

    lastControlChanged?: string;

    constructor() {}

    ngOnInit(): void {
        const checkboxes = this.form?.controls?.filter(c => c.type === ControlType.CHECKBOX);

        for (const control of (checkboxes || [])) {
            if (control.defaultValue) {
                this.checkboxValues.push(control.defaultValue);
            }
        }
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this._updateValueAfterInit();
        }, 100);
    }

    private _updateValueAfterInit() {
        for (const control of (this.form?.controls || [])) {
            this.updateValue(control, document.querySelector('#' + control.selector) as HTMLInputElement);
        }
    }

    toggleRadio(control: Control, value: string | number) {
        const parsedValue = value.toString();

        if (control.canClear && control.value === parsedValue) {
            return '';
        } else {
            return parsedValue;
        }
    }

    toggleCheckbox(value: string | number) {
        const parsedValue = value.toString();

        if (this.checkboxValues.includes(parsedValue)) {
            const index = this.checkboxValues.indexOf(parsedValue);
            this.checkboxValues.splice(index, 1);
        } else {
            this.checkboxValues.push(parsedValue);
        }

        return this.checkboxValues.join(',');
    }

    checkboxSelected(value: string | number, control: Control) {
        return this.checkboxValues.includes(value.toString()) || control.value === value;
    }

    getControlType() {
        return ControlType;
    }

    updateValue(control: Control, input: HTMLInputElement) {
        const selectedControl = this.form!.controls.find(c => c.selector === control.selector);

        selectedControl!.value = input?.value;
        selectedControl!.state = input?.validity;
        selectedControl!.valid = selectedControl!.state?.valid;

        this.lastControlChanged = control.selector;

        this._updateFormValueAndValidity();
    }

    private _updateFormValueAndValidity() {
        const value: { [key: string]: any } = {};

        for (const control of (this.form?.controls || [])) {
            value[control.selector] = control.value;
        }

        this.form!.value = value;
        this.form!.lastControlChanged = this.lastControlChanged;

        for (const control of (this.form?.controls || [])) {
            if (!control.valid && ![ControlType.TITLE, ControlType.SPACER].includes(control.type)) {
                this.form!.valid = false;
                return;
            }
        }

        this.form!.valid = true;

        this.formChanged.emit(this.form);
    }

}