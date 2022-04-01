import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShorturlRedirectionComponent } from './shorturl-redirection.component';

describe('ShorturlRedirectionComponent', () => {
  let component: ShorturlRedirectionComponent;
  let fixture: ComponentFixture<ShorturlRedirectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShorturlRedirectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShorturlRedirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
