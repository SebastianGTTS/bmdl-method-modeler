import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Artifact } from '../../development-process-registry/artifact';
import { ArtifactService } from '../../development-process-registry/artifact.service';
import { MultipleSelection } from '../../development-process-registry/multiple-selection';

@Component({
  selector: 'app-artifacts-selection-form',
  templateUrl: './artifacts-selection-form.component.html',
  styleUrls: ['./artifacts-selection-form.component.css']
})
export class ArtifactsSelectionFormComponent implements OnInit, OnChanges {

  @Input() artifacts: MultipleSelection<Artifact>[][];

  @Output() submitArtifactsForm = new EventEmitter<FormArray>();

  artifactsForm: FormGroup = this.fb.group({
    artifacts: this.fb.array([]),
  });

  methodElements: Artifact[] = [];
  listNames: string[] = [];

  constructor(
    private fb: FormBuilder,
    private artifactService: ArtifactService,
  ) {
  }

  ngOnInit() {
    this.loadMethodElements();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.artifacts) {
      this.loadForm(changes.artifacts.currentValue);
    }
  }

  add() {
    this.formArray.push(this.fb.array([]));
  }

  remove(index: number) {
    this.formArray.removeAt(index);
  }

  submitForm() {
    this.submitArtifactsForm.emit(this.artifactsForm.get('artifacts') as FormArray);
  }

  private loadForm(artifacts: MultipleSelection<Artifact>[][]) {
    const formArrays = artifacts.map((group) =>
      this.fb.array(group.map((element) =>
        this.fb.group({
          list: [element.list, Validators.required],
          element: {value: element.element, disabled: element.multiple},
          multiple: element.multiple,
          multipleElements: {value: element.multipleElements, disabled: element.multiple},
        })
      )),
    );
    this.artifactsForm.setControl('artifacts', this.fb.array(formArrays));
  }

  private loadMethodElements() {
    this.artifactService.getAll().then((artifacts) => {
      this.methodElements = artifacts.docs;
      this.listNames = [...new Set(this.methodElements.map((element) => element.list))];
    });
  }

  get formArray(): FormArray {
    return this.artifactsForm.get('artifacts') as FormArray;
  }

  createFormGroupFactory = () => this.fb.group({
    list: ['', Validators.required],
    element: null,
    multiple: false,
    multipleElements: false,
  })

}
