import { TestBed } from '@angular/core/testing';

import { DeleteBlogService } from './deleteblog-service';

describe('DeleteblogService', () => {
  let service: DeleteBlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteBlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
