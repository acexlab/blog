import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBlog } from './view-blog';

describe('ViewBlog', () => {
  let component: ViewBlog;
  let fixture: ComponentFixture<ViewBlog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBlog],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewBlog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
