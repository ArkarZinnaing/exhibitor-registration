import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getCompanyList(): Observable<any[]> {
    return this.http.post<any[]>(this.baseUrl , '');
  }


  
}
