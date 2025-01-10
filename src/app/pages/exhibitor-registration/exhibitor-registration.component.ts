
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomDropdownComponent } from '../../components/custom-dropdown/custom-dropdown.component';

@Component({
  selector: 'app-exhibitor-registration',
  templateUrl: './exhibitor-registration.component.html',
  styleUrls: ['./exhibitor-registration.component.scss'],
  imports : [ReactiveFormsModule,CommonModule,CustomDropdownComponent]
})
export class ExhibitorRegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  companies: any[] = [];
  filteredCompanies: any[] = [];
  countries: any[] = [];
  apiBaseUrl = 'https://staging-fha-2024.occamlab.com.sg/api';
  errorMessages: { [key: number]: string } = {};
  isLoading : boolean = false
  

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.registrationForm = this.fb.group({
      eventSelection: ['FHA-Food & Beverage', Validators.required],
      company: ['', Validators.required],
      exhibitors: this.fb.array([])
    });
  }
  


  ngOnInit() {
    this.loadCompanies();
    this.loadCountries();
    this.addExhibitor(); // Add first exhibitor card by default
  }

  // Load countries from API
  loadCountries() {
    this.http.get('/public/provinces.json').subscribe((response: any) => {
      // Get unique countries using Set
      const uniqueCountries = [...new Set(response.map((item: any) => item.country))];
      
      // Convert to required format
      this.countries = uniqueCountries.map(country => ({
        name: country
      }));
    });
  }

  // Load companies from API
  loadCompanies() {
    this.http.post(`${this.apiBaseUrl}/exhibitor-company-list` , '')
      .subscribe((response: any) => {
        this.companies = response.message;
        this.filterCompanies();
      });
  }

  // Filter companies based on event selection
  filterCompanies() {
    const selectedEvent = this.registrationForm.get('eventSelection')?.value;
    this.filteredCompanies = this.companies.filter(company => 
      company.S_event === selectedEvent
    );
  }

  // Get exhibitors form array
  get exhibitors() {
    return this.registrationForm.get('exhibitors') as FormArray;
  }



  selectCompany(companyName: string) {
    this.registrationForm.patchValue({ company: companyName });
  }

  selectCountry(countryName: string) {
    this.registrationForm.patchValue({ country: countryName });
 
  }



  // Create new exhibitor form group
  createExhibitor(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nameOnBadge: ['', Validators.required],
      jobTitle: ['', Validators.required],
      country: ['', Validators.required],
      companyOnBadge: ['', Validators.required]
    });
  }

  // Add new exhibitor card
  addExhibitor() {
    this.exhibitors.push(this.createExhibitor());
  }

  // Remove exhibitor card
  removeExhibitor(index: number) {
    if (this.exhibitors.length > 1) {
      this.exhibitors.removeAt(index);
      delete this.errorMessages[index];
    }
  }

  // Generate random 5-letter code
  generateGroupRegId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return Array(5).fill(0).map(() => 
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
  }

  // Submit registration
  onSubmit() {
    if (this.registrationForm.valid) {
      this.isLoading = true
      const groupRegId = this.generateGroupRegId();
      const selectedEvent = this.registrationForm.get('eventSelection')?.value;
      const company = this.registrationForm.get('company')?.value;

      // Clear previous error messages
      this.errorMessages = {};

      // Create promises array for all exhibitor registrations
      const registrationPromises = this.exhibitors.controls.map((control, index) => {
        const payload = {
          S_added_via: "Web Form",
          S_company: company,
          S_email_address: control.get('email')?.value,
          S_group_reg_id: groupRegId,
          S_name_on_badge: control.get('nameOnBadge')?.value,
          S_job_title: control.get('jobTitle')?.value,
          S_country: control.get('country')?.value,
          S_company_on_badge: control.get('companyOnBadge')?.value,
          SB_event_fha: selectedEvent === 'FHA-Food & Beverage',
          SB_event_prowine: selectedEvent === 'Prowine Singapore'
        };

 
        
        return this.http.post(`${this.apiBaseUrl}/add-exhibitor`, payload)
          .pipe(
            catchError(error => {
              this.errorMessages[index] = error.error.message;
              return of(null);
            })
          ).toPromise();
      });

      // Execute all registration requests
      Promise.all(registrationPromises)
        .then(results => {
          if (Object.keys(this.errorMessages).length === 0) {
            // All registrations successful
            this.isLoading = false
            console.log('All registrations completed successfully');
          }
        });
    }
  }

  // Event selection change handler
  onEventSelectionChange() {
    this.filterCompanies();
    this.registrationForm.patchValue({ company: '' });
  }

  onCompanySelect(company: any) {
    this.registrationForm.patchValue({ company: company.S_company });
  }

  onCountrySelect(country: any) {
    this.registrationForm.patchValue({ country: country.name });
  }
}