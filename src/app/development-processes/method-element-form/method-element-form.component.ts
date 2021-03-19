import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MethodElement } from '../../development-process-registry/method-element';

@Component({
  selector: 'app-method-element-form',
  templateUrl: './method-element-form.component.html',
  styleUrls: ['./method-element-form.component.css']
})
export class MethodElementFormComponent implements OnChanges {

  @Input() methodElement: MethodElement = null;

  @Output() submitMethodElementForm = new EventEmitter<FormGroup>();

  methodElementForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    list: ['', Validators.required],
    description: [''],
  });

  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.methodElement) {
      this.loadForm(changes.methodElement.currentValue);
    }
  }

  private loadForm(methodElement: MethodElement) {
    this.methodElementForm.patchValue(methodElement);
  }

  submitForm() {
    this.submitMethodElementForm.emit(this.methodElementForm);
    if (this.methodElement === null) {
      this.methodElementForm.reset();
    }
  }

}
