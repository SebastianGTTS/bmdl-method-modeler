import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToolService } from '../../development-process-registry/tool.service';
import { Tool } from '../../development-process-registry/tool';
import { MultipleSelection } from '../../development-process-registry/multiple-selection';

@Component({
  selector: 'app-tools-selection-form',
  templateUrl: './tools-selection-form.component.html',
  styleUrls: ['./tools-selection-form.component.css']
})
export class ToolsSelectionFormComponent implements OnInit, OnChanges {

  @Input() tools: MultipleSelection<Tool>[];

  @Output() submitToolsForm = new EventEmitter<FormArray>();

  toolsForm: FormGroup = this.fb.group({
    tools: this.fb.array([]),
  });

  methodElements: Tool[] = [];
  listNames: string[] = [];

  constructor(
    private fb: FormBuilder,
    private toolService: ToolService,
  ) {
  }

  ngOnInit() {
    this.loadTools();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tools) {
      this.loadForm(changes.tools.currentValue);
    }
  }

  submitForm() {
    this.submitToolsForm.emit(this.toolsForm.get('tools') as FormArray);
  }

  private loadForm(tools: MultipleSelection<Tool>[]) {
    const formGroups = tools.map((tool) => this.fb.group({
      list: [tool.list, Validators.required],
      element: {value: tool.element, disabled: tool.multiple},
      multiple: tool.multiple,
      multipleElements: {value: tool.multipleElements, disabled: tool.multiple},
    }));
    this.toolsForm.setControl('tools', this.fb.array(formGroups));
  }

  private loadTools() {
    this.toolService.getAll().then((tools) => {
      this.methodElements = tools.docs;
      this.listNames = [...new Set(this.methodElements.map((element) => element.list))];
    });
  }

  createFormGroupFactory = () => this.fb.group({
    list: ['', Validators.required],
    element: null,
    multiple: false,
    multipleElements: false,
  })

}
