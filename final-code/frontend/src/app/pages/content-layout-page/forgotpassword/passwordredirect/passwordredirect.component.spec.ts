import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordredirectComponent } from './passwordredirect.component';

describe('PasswordredirectComponent', () => {
  let component: PasswordredirectComponent;
  let fixture: ComponentFixture<PasswordredirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordredirectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordredirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
