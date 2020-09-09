import { TestBed } from '@angular/core/testing';
import {FillUpFormsService} from './fill-up-forms.service';


describe('FillUpFormsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FillUpFormsService = TestBed.get(FillUpFormsService);
    expect(service).toBeTruthy();
  });
});
