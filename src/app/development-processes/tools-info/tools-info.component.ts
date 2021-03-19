import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ToolService } from '../../development-process-registry/tool.service';
import { Tool } from '../../development-process-registry/tool';

@Component({
  selector: 'app-tools-info',
  templateUrl: './tools-info.component.html',
  styleUrls: ['./tools-info.component.css']
})
export class ToolsInfoComponent implements OnInit, OnChanges {

  @Input() elements: { list: string, element: Tool }[];
  @Input() selection: Tool[][];

  @Output() submitToolForm = new EventEmitter<FormArray>();

  methodElements: Tool[] = [];

  form: FormGroup = this.fb.group({
    elements: this.fb.array([]),
  });

  constructor(
    private fb: FormBuilder,
    private toolService: ToolService,
  ) {
  }

  ngOnInit() {
    this.loadMethodElements();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selection || changes.groups) {
      this.loadForm();
    }
  }

  submitForm() {
    this.submitToolForm.emit(this.elementsFormArray);
  }

  private loadForm() {
    this.generateControls();
    if (this.selection) {
      this.elementsFormArray.patchValue(this.selection);
    }
  }

  private generateControls() {
    const elements = this.elements.map(() => this.fb.array([this.fb.control(null)]));
    this.form.setControl('elements', this.fb.array(elements));
  }

  private loadMethodElements() {
    this.toolService.getAll().then((tools) => this.methodElements = tools.docs);
  }

  get elementsFormArray(): FormArray {
    return this.form.get('elements') as FormArray;
  }

}
