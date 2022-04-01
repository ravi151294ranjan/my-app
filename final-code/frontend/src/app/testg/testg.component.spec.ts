import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestgComponent } from './testg.component';

describe('TestgComponent', () => {
  let component: TestgComponent;
  let fixture: ComponentFixture<TestgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
