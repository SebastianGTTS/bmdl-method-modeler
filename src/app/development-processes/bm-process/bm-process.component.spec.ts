import { BmProcessComponent } from './bm-process.component';
import { createRoutingFactory, Spectator } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';
import { BmProcessDiagramComponent } from '../bm-process-diagram/bm-process-diagram.component';
import { BmProcessService } from '../../development-process-registry/bm-process.service';
import { BmProcess } from '../../development-process-registry/bm-process';
import { ReactiveFormsModule } from '@angular/forms';
import { DevelopmentMethodService } from '../../development-process-registry/development-method.service';

describe('BmProcessComponent', () => {
  let spectator: Spectator<BmProcessComponent>;
  const createComponent = createRoutingFactory({
    component: BmProcessComponent,
    declarations: [
      MockComponent(BmProcessDiagramComponent),
    ],
    detectChanges: false,
    imports: [ReactiveFormsModule],
    mocks: [BmProcessService, DevelopmentMethodService],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.inject(BmProcessService).getBmProcess.and.returnValue(Promise.resolve(new BmProcess({name: 'Test'})));
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });
});
