import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentStructureComponent } from './content-structure.component';

describe('ContentStructureComponent', () => {
  let component: ContentStructureComponent;
  let fixture: ComponentFixture<ContentStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentStructureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
