import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/service/auth-service.component';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../core/service/company.service';
import { InternshipCardComponent } from "../internship-card/internship-card.component";

@Component({
  selector: 'app-single-company',
  standalone: true,
  imports: [InternshipCardComponent],
  templateUrl: './single-company.component.html',
})
export class SingleCompanyComponent implements OnInit {
  isLoading = true;
  companyId: any;
  company: any;
  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.companyId = params.get('id');
      if (this.companyId) {
        this.fetchCompany(this.companyId);
      }
    });
  }
  fetchCompany(companyId: any) {
    this.companyService.getCompanyById(companyId).subscribe({
      next: (response) => {
        console.log('Fetched data:', response);
        this.company = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching data:', err);
      },
    });
  }
}
