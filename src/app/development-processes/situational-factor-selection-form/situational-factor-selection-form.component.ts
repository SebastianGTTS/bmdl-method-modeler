import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroupDirective } from '@angular/forms';
import { filter, map, tap } from 'rxjs/operators';
import { SituationalFactorDefinition } from '../../development-process-registry/situational-factor-definition';
import { getTypeaheadInputPipe } from '../../shared/utils';

@Component({
  selector: 'app-situational-factor-selection-form',
  templateUrl: './situational-factor-selection-form.component.html',
  styleUrls: ['./situational-factor-selection-form.component.css']
})
export class SituationalFactorSelectionFormComponent implements OnInit, OnDestroy {

  @Input() methodElements: SituationalFactorDefinition[];
  @Input() listNames: string[];

  @Output() remove = new EventEmitter<void>();

  private listChangeSubscription: Subscription;
  private factorChangeSubscription: Subscription;

  openListInput = new Subject<string>();
  openElementInput = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private formGroupDirective: FormGroupDirective,
  ) {
  }

  ngOnInit() {
    this.listChangeSubscription = this.listControl.valueChanges.pipe(
      filter((value) => this.factorControl.value && this.factorControl.value.list !== value),
      tap(() => this.elementControl.setValue({
        factor: null,
        value: null,
      })),
    ).subscribe();
    this.factorChangeSubscription = this.factorControl.valueChanges.pipe(
      tap(() => this.valueControl.setValue(null)),
      filter((value) => value && this.listControl.value !== value.list),
      tap((value) => this.listControl.setValue(value.list)),
    ).subscribe();
  }

  ngOnDestroy() {
    if (this.listChangeSubscription) {
      this.listChangeSubscription.unsubscribe();
    }
    if (this.factorChangeSubscription) {
      this.factorChangeSubscription.unsubscribe();
    }
    this.openListInput.complete();
    this.openElementInput.complete();
  }

  searchLists = (input: Observable<string>) => {
    return merge(getTypeaheadInputPipe(input), this.openListInput).pipe(
      map((term) => this.listNames.filter((listItem) => listItem.toLowerCase().includes(term.toLowerCase())).slice(0, 7)),
    );
  }

  searchElements = (input: Observable<string>) => {
    return merge(getTypeaheadInputPipe(input), this.openElementInput).pipe(
      map(
        (term) => this.methodElements.filter((methodElement) =>
          (!this.listControl.value || methodElement.list.toLowerCase() === this.listControl.value.toLowerCase()) &&
          methodElement.name.toLowerCase().includes(term.toLowerCase())
        ).slice(0, 7)
      ),
    );
  }

  get values() {
    if (!this.factorControl.value) {
      return [];
    }
    return this.factorControl.value.values;
  }

  formatter(x: { name: string }) {
    return x.name;
  }

  get listControl() {
    return this.formGroup.get('list');
  }

  get elementControl() {
    return this.formGroup.get('element') as FormControl;
  }

  get factorControl() {
    return this.elementControl.get('factor') as FormControl;
  }

  get valueControl() {
    return this.elementControl.get('value') as FormControl;
  }

  get formGroup() {
    return this.formGroupDirective.control;
  }

}
