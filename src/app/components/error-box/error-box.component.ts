import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-box',
  imports: [],
  templateUrl: './error-box.component.html',
  styleUrl: './error-box.component.scss'
})
export class ErrorBoxComponent  {
    @Input() errorCount : number = 0 
    @Input() totalForm : number = 0
 
   
}
