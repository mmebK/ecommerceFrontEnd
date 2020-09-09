import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {Country} from '../common/country';
import {State} from '../common/state';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {

  _embedded: {
    states: State[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class FillUpFormsService {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private stateUrl = 'http://localhost:8080/api/states';


  constructor(private httpClient: HttpClient) {
  }


  getCreditCardMonths(): Observable<number[]> {
    let data: number[] = [];

    let startMonth: number = new Date().getMonth() + 1;
    for (let month = startMonth; month <= 12; month++) {
      data.push(month);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    let startYear: number = new Date().getFullYear();
    let endYear: number = startYear + 10;

    for (let year = startYear; year <= endYear; year++) {
      data.push(year);
    }

    return of(data);
  }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(map(data => data._embedded.countries));
  }

  getState(countryCode: string): Observable<State[]> {

    let searchStateUrl = `${this.stateUrl}/search/findByCountryCode?code=${countryCode}`;
    return this.httpClient.get<GetResponseStates>(searchStateUrl).pipe(map(data => data._embedded.states));
  }


}
