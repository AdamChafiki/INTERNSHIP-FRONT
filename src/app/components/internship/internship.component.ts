import {Component, OnInit} from '@angular/core';
import {InternshipCardComponent} from '../internship-card/internship-card.component';
import {AuthService} from '../../core/service/auth-service.component';
import {InternshipService} from '../../core/service/internship.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-internship',
  standalone: true,
  imports: [InternshipCardComponent, FormsModule],
  templateUrl: './internship.component.html',
})
export class InternshipComponent implements OnInit {

  data: any = [];
  isLoading = true
  searchQuery: string = ""

  constructor(
    private authService: AuthService,
    private internshipService: InternshipService,
  ) {
  }

  ngOnInit(): void {
    this.internshipService.getAllInternships().subscribe({
      next: (response) => {
        console.log(response);
        this.data = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching company data2:', err);
      },
    });
  }

  search($event: any) {
    this.isLoading = true
    const query = $event.target.query.value
    this.internshipService.searchInternship(query).subscribe({
      next: (response) => {
        console.log(response);
        this.data = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching company data2:', err);
      },
    });

  }


}
