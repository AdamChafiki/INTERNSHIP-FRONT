import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { InternshipComponent } from './components/internship/internship.component';
import { VerifyAccountComponent } from './components/verify-account/verify-account.component';
import { GuestGuard } from './core/guard/guest.guard';
import { DashboardEmployerComponent } from './components/dashboard-employer/main-layout/dashboard-employer.component';
import { roleGuard } from './core/guard/role.guard';
import { CompanyComponent } from './components/dashboard-employer/company/company.component';
import { InternshipEmployerComponent } from './components/dashboard-employer/internship/internship.component';
import { SingleInternshipComponent } from './components/single-internship/single-internship.component';
import { DashboardComponent } from './components/dashboard-employer/dashboard/dashboard.component';
import { DashboardInternshipSeekerComponent } from './components/dashboard-internship-seeker/main-layout/main-layout.component';
import { JobApplicationComponent } from './components/dashboard-internship-seeker/job-application/job-application.component';
import { ProfileComponent } from './components/dashboard-internship-seeker/profile/profile.component';
import { SingleProfileComponent } from './components/single-profile/single-profile.component';
import { DashboardSeekerComponent } from './components/dashboard-internship-seeker/dashboard/dashboard.component';
import { ApplicationComponent } from './components/dashboard-employer/application/application.component';
import { CompanyAllComponent } from './components/company/company.component';
import { SingleCompanyComponent } from './components/single-company/single-company.component';
import { EmailComponent } from './components/dashboard-internship-seeker/email/email.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'internships',
    component: InternshipComponent,
  },
  {
    path: 'company',
    component: CompanyAllComponent,
  },
  {
    path: 'internship/:id',
    component: SingleInternshipComponent,
  },
  {
    path: 'verify-account',
    component: VerifyAccountComponent,
  },
  {
    path: 'employer-dashboard',
    component: DashboardEmployerComponent,
    canActivate: [roleGuard],
    data: { role: 'ROLE_EMPLOYER' },
    children: [
      { path: '', component: DashboardComponent },
      { path: 'company', component: CompanyComponent },
      { path: 'internship', component: InternshipEmployerComponent },
      { path: 'application', component: ApplicationComponent },
    ],
  },
  {
    path: 'internship-seeker-dashboard',
    component: DashboardInternshipSeekerComponent,
    canActivate: [roleGuard],
    data: { role: 'ROLE_INTERNSHIP_SEEKER' },
    children: [
      {
        path: '',
        component: DashboardSeekerComponent,
      },
      {
        path: 'job-application',
        component: JobApplicationComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'email',
        component: EmailComponent
      }
    ],
  },
  {
    path: 'internship-seeker/:id',
    component: SingleProfileComponent,
  },
  {
    path: 'company/:id',
    component: SingleCompanyComponent,
  },
];
