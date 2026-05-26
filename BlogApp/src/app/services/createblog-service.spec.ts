import { TestBed } from '@angular/core/testing';

import { CreateblogService } from './createblog-service';

describe('CreateblogService', () => {
  let service: CreateblogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateblogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
