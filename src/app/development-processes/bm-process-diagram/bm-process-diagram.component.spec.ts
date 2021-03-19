import { BmProcessDiagramComponent } from './bm-process-diagram.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';
import { SelectProcessPatternFormComponent } from '../select-process-pattern-form/select-process-pattern-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DevelopmentMethodService } from '../../development-process-registry/development-method.service';
import { ProcessPatternService } from '../shared/process-pattern.service';

describe('BmProcessDiagramComponent', () => {
  let spectator: Spectator<BmProcessDiagramComponent>;
  const createComponent = createComponentFactory({
    component: BmProcessDiagramComponent,
    declarations: [
      MockComponent(SelectProcessPatternFormComponent),
    ],
    imports: [ReactiveFormsModule],
    mocks: [DevelopmentMethodService, ProcessPatternService],
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
