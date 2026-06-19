import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter, Routes } from "@angular/router";
import { AppComponent } from "./app/app.component";
import { provideHttpClient } from "@angular/common/http";

export enum Paths {
  LOGIN = 'login',
  REGISTER = 'register',
  HOME = ''
}

const routes: Routes = [
  { path: Paths.HOME, loadComponent: () => import('./app/pages/home/home.component').then(m => m.HomeComponent) },
  { path: '**', loadComponent: () => import('./app/pages/not-found/not-found.component').then(m => m.NotFoundComponent) }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
});