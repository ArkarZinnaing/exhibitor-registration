import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpConfigInterceptor } from './httpconfig.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    provideHttpClient(),
    provideAnimations()
  ]
};
