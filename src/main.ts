import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeDa from '@angular/common/locales/da';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Needed for the merged E-conomic budget tables, which format numbers with
// an explicit 'da-DK' locale argument. This only registers the locale data
// for that explicit use — it doesn't change the app's default LOCALE_ID,
// so nothing else on the site is affected.
registerLocaleData(localeDa);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
