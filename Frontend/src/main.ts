import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';  // Import animations provider

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),  // Provides routing
    provideHttpClient(),    // Provides HttpClient
    provideAnimations()     // Enables Angular animations
  ]
}).catch(err => console.error(err));
