// data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GetLocalJsonService {
  private provincesFilePath = environment.provincesJson;  

  constructor(private http: HttpClient) {}

  getProvincesData(): Observable<any> {
    return this.http.get<any>(this.provincesFilePath);  
  }
}
