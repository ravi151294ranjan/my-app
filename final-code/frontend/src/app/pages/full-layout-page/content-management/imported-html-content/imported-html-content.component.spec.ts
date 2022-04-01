import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedHtmlContentComponent } from './imported-html-content.component';

describe('ImportedHtmlContentComponent', () => {
  let component: ImportedHtmlContentComponent;
  let fixture: ComponentFixture<ImportedHtmlContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportedHtmlContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportedHtmlContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
