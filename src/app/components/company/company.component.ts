import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../core/service/company.service';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './company.component.html',
})
export class CompanyAllComponent implements OnInit {
  isLoading = true;
  companies: any = [];

  constructor(private companyService: CompanyService) {}
  ngOnInit(): void {
    this.companyService.getAllCompany().subscribe({
      next: (response) => {
        console.log(response);

        this.companies = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching companies:', err);
      },
    });
  }
}
