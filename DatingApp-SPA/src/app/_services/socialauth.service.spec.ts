/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SocialauthService } from './socialauth.service';

describe('Service: Socialauth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocialauthService]
    });
  });

  it('should ...', inject([SocialauthService], (service: SocialauthService) => {
    expect(service).toBeTruthy();
  }));
});
