import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsInfoComponent } from './tools-info.component';

describe('ToolsInfoComponent', () => {
  let component: ToolsInfoComponent;
  let fixture: ComponentFixture<ToolsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
