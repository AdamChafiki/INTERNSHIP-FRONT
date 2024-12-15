import { Component, OnInit } from '@angular/core';
import { InternshipCardComponent } from '../internship-card/internship-card.component';
import { AuthService } from '../../core/service/auth-service.component';
import { InternshipService } from '../../core/service/internship.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-internship',
  standalone: true,
  imports: [InternshipCardComponent, FormsModule],
  templateUrl: './internship.component.html',
})
export class InternshipComponent implements OnInit {
  data: any = [];
  isLoading = true;
  searchQuery: string = '';
  locationFilter: string = ''; 

  constructor(
    private authService: AuthService,
    private internshipService: InternshipService
  ) {}

  ngOnInit(): void {
    this.fetchInternships();
  }

  fetchInternships(query: string = '', location: string = ''): void {
    this.isLoading = true;

    this.internshipService
      .searchInternshipsByLocationAndTitle(query, location)
      .subscribe({
        next: (data) => {
          this.data = data.length === 0 ? [] : data; 
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching internships:', err);
          this.isLoading = false;
        },
      });
  }

  // Handle search query input
  search($event: any): void {
    const query = $event.target.query.value.trim();
    console.log('Search Query: ', query); 
    this.searchQuery = query; 
    this.fetchInternships(query, this.locationFilter); 
  }


  filterByLocation(event: Event): void {
    const selectedLocation = (event.target as HTMLSelectElement).value;
    this.locationFilter = selectedLocation;
    this.fetchInternships(this.searchQuery, selectedLocation); 
  }
}
