/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AutthService } from './auth.service';

describe('Service: Autth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AutthService]
    });
  });

  it('should ...', inject([AutthService], (service: AutthService) => {
    expect(service).toBeTruthy();
  }));
});
