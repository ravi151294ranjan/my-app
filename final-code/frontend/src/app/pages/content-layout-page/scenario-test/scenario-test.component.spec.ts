import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioTestComponent } from './scenario-test.component';

describe('ScenarioTestComponent', () => {
  let component: ScenarioTestComponent;
  let fixture: ComponentFixture<ScenarioTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenarioTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
