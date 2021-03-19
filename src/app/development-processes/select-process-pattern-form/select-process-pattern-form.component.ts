import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProcessPattern } from '../shared/process-pattern';

@Component({
  selector: 'app-select-process-pattern-form',
  templateUrl: './select-process-pattern-form.component.html',
  styleUrls: ['./select-process-pattern-form.component.css']
})
export class SelectProcessPatternFormComponent implements OnChanges {

  @Input() processPatterns: ProcessPattern[];

  @Output() submitProcessPatternForm = new EventEmitter<FormGroup>();

  addProcessPatternForm: FormGroup = this.fb.group({
    processPatternId: [null, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.processPatterns) {
      const processPatterns = changes.processPatterns.currentValue;
      if (processPatterns && processPatterns.length > 0) {
        this.addProcessPatternForm.get('processPatternId').enable();
      } else {
        this.addProcessPatternForm.get('processPatternId').disable();
      }
    }
  }

  submitForm() {
    this.submitProcessPatternForm.emit(this.addProcessPatternForm);
  }

}
