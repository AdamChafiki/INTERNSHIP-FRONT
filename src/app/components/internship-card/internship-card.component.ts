import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-internship-card',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './internship-card.component.html',
})
export class InternshipCardComponent {
  @Input() internship: any
}
