import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';  // ✅ Correct import path
import { provideHttpClient } from '@angular/common/http'; // Import HttpClient provider

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),  // ✅ Provides routing
    provideHttpClient()     // ✅ Provides HttpClient
  ]
}).catch(err => console.error(err));
