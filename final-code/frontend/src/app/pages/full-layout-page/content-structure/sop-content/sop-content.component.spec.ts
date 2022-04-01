import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SopContentComponent } from './sop-content.component';

describe('SopContentComponent', () => {
  let component: SopContentComponent;
  let fixture: ComponentFixture<SopContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SopContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SopContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
