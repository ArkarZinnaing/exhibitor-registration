import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-indicator',
  imports: [CommonModule],
  templateUrl: './progress-indicator.component.html',
  styleUrl: './progress-indicator.component.scss'
})
export class ProgressIndicatorComponent {

  @Input() currentSubmissionCount: number = 0;
  @Input() totalSubmissionCount: number = 0;


}
