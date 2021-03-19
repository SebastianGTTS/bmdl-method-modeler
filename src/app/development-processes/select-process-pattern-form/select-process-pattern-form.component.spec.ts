import { SelectProcessPatternFormComponent } from './select-process-pattern-form.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveFormsModule } from '@angular/forms';

describe('SelectProcessPatternFormComponent', () => {
  let spectator: Spectator<SelectProcessPatternFormComponent>;
  const createComponent = createComponentFactory({
    component: SelectProcessPatternFormComponent,
    declarations: [],
    imports: [ReactiveFormsModule],
  });

  beforeEach(() => spectator = createComponent({
    props: {
      processPatterns: [],
    }
  }));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
