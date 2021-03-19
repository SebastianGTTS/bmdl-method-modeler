import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SituationalFactorService } from '../../development-process-registry/situational-factor.service';
import { SituationalFactorDefinition } from '../../development-process-registry/situational-factor-definition';

@Component({
  selector: 'app-situational-factor',
  templateUrl: './situational-factor.component.html',
  styleUrls: ['./situational-factor.component.css']
})
export class SituationalFactorComponent implements OnInit, OnDestroy {

  situationalFactor: SituationalFactorDefinition;

  form: FormGroup = this.fb.group({
    list: ['', Validators.required],
    values: this.fb.array([]),
  });
  orderedForm: FormGroup = this.fb.group({
    ordered: [false, Validators.required],
  });

  private routeSubscription: Subscription;
  private orderedSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private situationalFactorService: SituationalFactorService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe(map => this.loadSituationalFactor(map.get('id')));
    this.orderedSubscription = this.orderedForm.valueChanges.subscribe((formValue) => this.updateSituationalFactorValue(formValue));
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.orderedSubscription) {
      this.orderedSubscription.unsubscribe();
    }
  }

  loadSituationalFactor(id: string) {
    this.situationalFactorService.get(id).then(
      (situationalFactor) => {
        this.situationalFactor = situationalFactor;
        this.form.patchValue(situationalFactor);
        this.valuesFormArray.clear();
        this.situationalFactor.values.forEach(
          (value, index) => this.valuesFormArray.setControl(index, this.fb.control(value, Validators.required))
        );
        this.orderedForm.patchValue(situationalFactor, {emitEvent: false});
      }
    ).catch(
      error => console.log('LoadSituationalFactor: ' + error)
    );
  }

  updateSituationalFactor(form: FormGroup) {
    this.updateSituationalFactorValue(form.value);
  }

  updateSituationalFactorValue(value: any) {
    const update = (currentElement: SituationalFactorDefinition) => {
      currentElement.update(value);
      return currentElement;
    };
    this.situationalFactorService.update(this.situationalFactor._id, update).then(
      () => this.loadSituationalFactor(this.situationalFactor._id)
    ).catch(
      error => console.log('UpdateSituationalFactorValue: ' + error)
    );
  }

  get valuesFormArray() {
    return this.form.get('values') as FormArray;
  }

}
