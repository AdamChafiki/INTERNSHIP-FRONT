import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InternshipSeekerService } from '../../core/service/internship-seeker.service';
import { FileService } from '../../core/service/file.service';

@Component({
  selector: 'app-single-profile',
  standalone: true,
  templateUrl: './single-profile.component.html',
})
export class SingleProfileComponent implements OnInit {
  data: any;
  isLoading = true;
  userId: string | null = null;
  selectedFile: File | null = null; // Variable to store the selected file

  constructor(
    private route: ActivatedRoute,
    private internshipSeekerService: InternshipSeekerService,
    private file: FileService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('id');
      if (this.userId) {
        this.fetchInternshipSeekerData(this.userId);
      }
    });
  }

  fetchInternshipSeekerData(userId: string): void {
    this.internshipSeekerService.getInternshipSeeker(userId).subscribe({
      next: (response) => {
        console.log('Fetched data:', response);
        this.data = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching data:', err);
      },
    });
  }

  getCv(userId: any) {
    this.file.getCv(userId).subscribe({
      next: (response) => {
        console.log(response);
        const url = window.URL.createObjectURL(response);
        window.open(url);
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }

}
