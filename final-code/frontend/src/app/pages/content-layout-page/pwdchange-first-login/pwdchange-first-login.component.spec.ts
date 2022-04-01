import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PwdchangeFirstLoginComponent } from './pwdchange-first-login.component';

describe('PwdchangeFirstLoginComponent', () => {
  let component: PwdchangeFirstLoginComponent;
  let fixture: ComponentFixture<PwdchangeFirstLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PwdchangeFirstLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PwdchangeFirstLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
