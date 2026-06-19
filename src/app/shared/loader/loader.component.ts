import { Component } from "@angular/core";
import { LoaderService } from "../../services/loader.service";

@Component({
    selector: 'my-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    standalone: true
})
export class LoaderComponent {

    constructor(private _loaderService: LoaderService) {}

    showLoader() {
        return !!this._loaderService.getQueue().length;
    }

}