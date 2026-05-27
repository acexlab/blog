import { TestBed } from '@angular/core/testing';

import { ViewblogService } from './viewblog-service';

describe('ViewblogService', () => {
  let service: ViewblogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewblogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
