import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { ToastrModule, provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideToastr({
      timeOut: 300000, // Default timeout for all toasts
      positionClass: 'toast-top-right', // Default position
      preventDuplicates: true, // Prevent duplicate messages
    }),
  provideHttpClient(),
    provideAnimations()
  ]
};
