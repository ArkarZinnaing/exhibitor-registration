import { Component } from '@angular/core';
import { ExhibitorRegistrationComponent } from './pages/exhibitor-registration/exhibitor-registration.component';
import { HeaderComponent } from './components/header/header.component';
// import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent ,ExhibitorRegistrationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'exhibitor-registration';
}
