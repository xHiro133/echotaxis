import { Component, OnInit } from '@angular/core';
import { ThemesService } from './services/themes.service';
import { TranslateService } from './services/translate.service';
import { Themes } from './models/themes.model';
import { Observable } from 'rxjs';
import { Router, RouterOutlet } from '@angular/router';
import { LoaderService } from './services/loader.service';
import { LoaderComponent } from './shared/loader/loader.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [LoaderComponent, RouterOutlet]
})
export class AppComponent implements OnInit {

  title = 'echotaxis';

  loadedServices: any[] = [];

  constructor(
    private _router: Router,
    private _loaderService: LoaderService,
    private _themesService: ThemesService,
    private _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    const servicesToLoad = [
      this._themesService.changeTheme(this._themesService.getCurrentTheme().name as Themes),
      this._translateService.setLanguage(this._translateService.getCurrentLanguageCode())
    ];

    this.loadedServices = new Array(servicesToLoad.length).fill(false);

    this._loaderService.show();

    for (let i = 0; i < servicesToLoad.length; i++) {
      const service = servicesToLoad[i];

      (service as Observable<any>).subscribe(() => {
        this.loadedServices[i] = true;
        this._checkAllServicesLoaded();
      });
    }
  }

  getTranslation(message: string) {
    return this._translateService.translate(message);
  }

  private _checkAllServicesLoaded() {
    for (const loaded of this.loadedServices) {
      if (!loaded) {
        return false;
      }
    }

    const path = [...new Set(location.pathname.split('/'))];

    this._loaderService.hide();

    this._router.navigate(['randomBullshitGo'], { skipLocationChange: true, queryParamsHandling: 'preserve' }).then(() => {
      this._router.navigate([...path], { queryParamsHandling: 'preserve' });
    });

    return true;
  }

}
