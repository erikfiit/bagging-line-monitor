import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideMissingTranslationHandler, provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { MachineSocket } from './core/data/machine-socket';
import { SimulatedMachineSocket } from './core/data/simulated-machine-socket';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { LanguageService } from './core/services/language.service';
import { ShowLastPartOfKey } from './core/services/missing-translation';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideTranslateService({
      fallbackLang: 'en',
      missingTranslationHandler: provideMissingTranslationHandler(ShowLastPartOfKey),
    }),
    provideTranslateHttpLoader({ prefix: 'i18n/', suffix: '.json' }),
    provideAppInitializer(() => inject(LanguageService).init()),
    // WebSocketMachineSocket for real BE
    { provide: MachineSocket, useClass: SimulatedMachineSocket },
  ],
};
