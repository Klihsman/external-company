import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import ExternalCompany from '../models/external-company';

@Injectable({
  providedIn: 'root',
})
export class ExternalCompanyService {
  constructor(public http: HttpClient) {}

  ExternalCompaniesList(): Observable<HttpResponse<ExternalCompany[]>> {
    return this.http.get<ExternalCompany[]>(
      'https://655cf25525b76d9884fe3153.mockapi.io/v1/external-companies',
      { observe: 'response' }
    );
  }

  DeleteExternalCompany(id: string) {
    return this.http.delete(
      `https://655cf25525b76d9884fe3153.mockapi.io/v1/external-companies/${id}`,
      { observe: 'response' }
    );
  }

  RegisterExternalCompany(externalCompany: ExternalCompany) {
    return this.http.post(
      `https://655cf25525b76d9884fe3153.mockapi.io/v1/external-companies`,
      externalCompany,
      { observe: 'response' }
    );
  }

  UpdateExternalCompany(externalCompany: ExternalCompany) {
    return this.http.put(
      `https://655cf25525b76d9884fe3153.mockapi.io/v1/external-companies/` +
        externalCompany.id,
      externalCompany,
      { observe: 'response' }
    );
  }
}
