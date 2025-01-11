import { Component } from '@angular/core';
import { ExhibitorRegistrationComponent } from './pages/exhibitor-registration/exhibitor-registration.component';
// import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [ExhibitorRegistrationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'exhibitor-registration';
}
