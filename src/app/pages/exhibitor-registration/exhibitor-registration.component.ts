
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomDropdownComponent } from '../../components/custom-dropdown/custom-dropdown.component';
import { environment } from '../../../environments/environment';
import { SuccessModalComponent } from '../../components/success-modal/success-modal.component';
import { ModalService } from '../../services/modal.service';
import { HeaderComponent } from "../../components/header/header.component";
import { GetLocalJsonService } from '../../services/getlocaljson.service';
import { ErrorBoxComponent } from "../../components/error-box/error-box.component";

@Component({
  selector: 'app-exhibitor-registration',
  templateUrl: './exhibitor-registration.component.html',
  styleUrls: ['./exhibitor-registration.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, CustomDropdownComponent, SuccessModalComponent, HeaderComponent, ErrorBoxComponent]
})
export class ExhibitorRegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  companies: any[] = [];
  filteredCompanies: any[] = [];
  countries: any[] = [];
  apiBaseUrl = environment.baseUrl;

  isLoading : boolean = false;
  groupRegId : string = '';

  issubmitFailed : boolean = false;
  errorMessages: { [key: number]: string } = {};

  // progress bar
  currentSubmissionCount: number = 0;
totalSubmissionCount: number = 0;
isSubmitting: boolean = false;
submissionProgress: number = 0
  

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private modalService : ModalService,
    private getLocalJsonService : GetLocalJsonService
  ) {
    this.registrationForm = this.fb.group({
      eventSelection: ['', Validators.required],
      company: ['', Validators.required],
      exhibitors: this.fb.array([])
    });
  }
  


  ngOnInit() {
    this.loadCountries();
    this.addExhibitor(); // Add first exhibitor card by default
  }

  // Load countries from API
  loadCountries() {
    // this.http.get('/public/provinces.json').subscribe((response: any) => {

    //   const uniqueCountries = [...new Set(response.map((item: any) => item.country))];
      
  
    //   this.countries = uniqueCountries.map(country => ({
    //     name: country
    //   }));
    // });
    this.getLocalJsonService.getProvincesData().subscribe((response: any) => {

        const uniqueCountries = [...new Set(response.map((item: any) => item.country))];
        
    
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

  // get error length
  getErrLength(): number {
    return Object.keys(this.errorMessages).length;
  }

  // Submit registration
  onSubmit() {
    if (this.registrationForm.valid) {

      this.isLoading = true;
      window.scrollTo(0, 0);
      this.isSubmitting = true;
      this.currentSubmissionCount = 0;
      this.submissionProgress = 0;
      this.totalSubmissionCount = this.exhibitors.length;
   
      this.groupRegId = this.generateGroupRegId();
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
          S_group_reg_id: this.groupRegId,
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
              this.issubmitFailed = true
              this.errorMessages[index] = error.error.message;
       
              this.groupRegId = '';
              this.isLoading = false;
              this.isSubmitting = false;
              this.submissionProgress = 0;
              return of(null);
            })
          ).toPromise().then(result => {
          if (result) {
            this.currentSubmissionCount++;
            this.submissionProgress = (this.currentSubmissionCount / this.totalSubmissionCount) * 100;
          }
          return result;
        });
      });

  
      // Execute all registration requests
      Promise.all(registrationPromises)
        .then(results => {
          if (Object.keys(this.errorMessages).length === 0) {
            this.submissionProgress = 100;
            setTimeout(() => {
            this.openModal();
            this.restForm();
          }, 500);
            console.log('All registrations completed successfully');
          }
        });
    }
  }

  restForm(){
    this.groupRegId = '';
    while (this.exhibitors.length > 0) {
      this.exhibitors.removeAt(0);
    }
    this.addExhibitor();
    this.registrationForm.reset({
      eventSelection: '', 
      company: '', 
      exhibitors: [] 
    });
    this.companies = [];
    this.filteredCompanies = [];
    this.isLoading = false;

    this.isSubmitting = false;
  this.currentSubmissionCount = 0;
  this.totalSubmissionCount = 0;
  this.submissionProgress = 0;
  return of(null);
  }

  // Event selection change handler
  onEventSelectionChange() {
    this.loadCompanies();
    this.registrationForm.patchValue({ company: '' });
  }

  onCompanySelect(company: any) {
    this.registrationForm.patchValue({ company: company.S_company });
  }

  onCountrySelect(country: any) {
    this.registrationForm.patchValue({ country: country.name });
  }


  openModal() {
    this.modalService.uniqueCode = this.groupRegId
    this.modalService.showModal();
  }
}