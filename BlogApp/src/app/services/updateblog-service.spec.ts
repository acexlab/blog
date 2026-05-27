import { TestBed } from '@angular/core/testing';

import { UpdateblogService } from './updateblog-service';

describe('UpdateblogService', () => {
  let service: UpdateblogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateblogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
