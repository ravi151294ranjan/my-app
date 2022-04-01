import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVideoContentComponent } from './videoContent.component';

describe('DashboardComponent', () => {
  let component: AdminVideoContentComponent;
  let fixture: ComponentFixture<AdminVideoContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminVideoContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminVideoContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
