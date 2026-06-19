import { Directive, ElementRef, Input, OnChanges } from "@angular/core";
import { FeaturesService } from "../services/features.service";

@Directive({
    selector: '[myFeature]',
    standalone: true
})
export class FeaturesDirective implements OnChanges {

    @Input('myFeature') feature = '';

    constructor(readonly el: ElementRef<HTMLElement>, private _featuresService: FeaturesService) {}

    ngOnChanges(): void {
        this._featuresService.isFeatureActive(this.feature).subscribe(res => {
            if (!res.active) {
                this.el.nativeElement.style.setProperty('display', 'none', 'important');
            }
        });
    }

}