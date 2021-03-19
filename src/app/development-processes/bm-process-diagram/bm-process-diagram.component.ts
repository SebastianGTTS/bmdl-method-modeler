import {
  AfterContentInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { BmProcess } from '../../development-process-registry/bm-process';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { BpmnService } from '../shared/bpmn.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProcessPatternService } from '../shared/process-pattern.service';
import { DevelopmentMethod } from '../../development-process-registry/development-method';
import { DevelopmentMethodService } from '../../development-process-registry/development-method.service';
import { ProcessPattern } from '../shared/process-pattern';
import { DiagramComponentInterface } from '../shared/diagram-component-interface';
import { SituationalFactor } from '../../development-process-registry/situational-factor';

@Component({
  selector: 'app-bm-process-diagram',
  templateUrl: './bm-process-diagram.component.html',
  styleUrls: ['./bm-process-diagram.component.css']
})
export class BmProcessDiagramComponent implements DiagramComponentInterface, OnInit, OnChanges, AfterContentInit, OnDestroy {

  @Input() bmProcess: BmProcess;

  @Output() saveBmProcess = new EventEmitter<Partial<BmProcess>>();

  private modeler: BpmnModeler;

  validDevelopmentMethods: DevelopmentMethod[] = null;
  selectDevelopmentMethodForm: FormGroup = this.fb.group({
    developmentMethodId: [null, Validators.required],
  });

  missingWarnings: string[] = [];
  lowWarnings: string[] = [];
  incorrectWarnings: string[] = [];
  isGeneratingWarnings = false;
  private wantsToGenerateWarnings = false;

  modalElement;
  modalDevelopmentMethod: DevelopmentMethod;
  modalProcessPattern: ProcessPattern;
  modalProcessPatterns: ProcessPattern[];
  private modalReference: NgbModalRef;

  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLDivElement>;
  @ViewChild('addProcessPatternModal', {static: true}) addProcessPatternModal: any;
  @ViewChild('deleteProcessPatternModal', {static: true}) deleteProcessPatternModal: any;
  @ViewChild('methodInfoModal', {static: true}) methodInfoModal: any;
  @ViewChild('patternInfoModal', {static: true}) patternInfoModal: any;
  @ViewChild('selectDevelopmentMethodModal', {static: true}) selectDevelopmentMethodModal: any;
  @ViewChild('selectProcessPatternModal', {static: true}) selectProcessPatternModal: any;
  @ViewChild('showTypesModal', {static: true}) showTypesModal: any;

  constructor(
    private bpmnService: BpmnService,
    private developmentMethodService: DevelopmentMethodService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private processPatternService: ProcessPatternService,
  ) {
  }

  ngOnInit() {
    this.modeler = this.bpmnService.getBmProcessModeler();
    const eventBus = this.modeler.get('eventBus');
    eventBus.on('bmp.deletePattern', (event, subProcessElement) => this.openDeleteProcessPatternModal(subProcessElement));
    eventBus.on('bmp.processPatterns', (event, businessObject) => this.openAddProcessPatternModal(businessObject));
    eventBus.on('bmp.removeMethod', (event, methodElement) => this.removeMethodFromTask(methodElement));
    eventBus.on('bmp.selectMethod', (event, taskElement) => this.openSelectDevelopmentMethodModal(taskElement));
    eventBus.on('bmp.selectPattern', (event, callActivityElement) => this.openSelectProcessPatternModal(callActivityElement));
    eventBus.on('bmp.showTypes', (event, taskElement) => this.openShowTypesModal(taskElement));
    eventBus.on('bmp.showMethod', (event, methodElement) => this.openMethodInfoModal(methodElement));
    eventBus.on('bmp.showPattern', (event, processPatternElement) => this.openProcessPatternInfoModal(processPatternElement));
    if (this.bmProcess) {
      this.loadBmProcess(this.bmProcess, true);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bmProcess && this.modeler) {
      this.loadBmProcess(changes.bmProcess.currentValue, changes.bmProcess.firstChange);
    }
  }

  ngAfterContentInit() {
    this.modeler.attachTo(this.canvas.nativeElement);
  }

  ngOnDestroy() {
    this.modeler.destroy();
  }

  private loadBmProcess(bmProcess: BmProcess, firstLoad: boolean) {
    if (bmProcess.processDiagram) {
      this.modeler.importXML(bmProcess.processDiagram).then(() => {
        if (firstLoad) {
          this.bpmnService.resizeView(this.modeler);
        }
        this.checkWarnings();
      }).catch(
        error => console.log('LoadBmProcess: ' + error)
      );
    } else {
      this.modeler.createDiagram();
    }
  }

  openAddProcessPatternModal(startingElement) {
    this.processPatternService.getValidProcessPatterns(
      [{list: 'initialisation', element: null}], [],
    ).then(list => {
      this.modalProcessPatterns = list.docs;
      this.modalElement = startingElement;
      this.modalReference = this.modalService.open(this.addProcessPatternModal, {size: 'lg'});
    }).catch(
      error => console.log('OpenAddProcessPatternModal: ' + error)
    );
  }

  addProcessPattern(addPatternForm: FormGroup) {
    this.modalReference.close();
    this.processPatternService.getProcessPattern(addPatternForm.value.processPatternId).then((processPattern) => {
      this.bpmnService.appendBpmn(this.modeler, processPattern, this.modalElement).then(() => {
        this.modeler.get('selection').deselect(this.modalElement);
        this.saveDiagram();
      }).catch(
        error => console.log('AddProcessPattern (inner): ' + error)
      );
    }).catch(
      error => console.log('AddProcessPattern: ' + error)
    );
  }

  openShowTypesModal(taskElement) {
    this.modalElement = taskElement;
    this.modalReference = this.modalService.open(this.showTypesModal, {size: 'lg'});
  }

  openDeleteProcessPatternModal(subProcessElement) {
    this.modalElement = subProcessElement;
    this.modalReference = this.modalService.open(this.deleteProcessPatternModal, {size: 'lg'});
  }

  deleteProcessPattern(subProcessElement) {
    const removeDecision = (event, element) => {
      if (element.element.businessObject && element.element.businessObject.method) {
        this.bmProcess.removeDecision(element.element.id);
      }
    };
    const eventBus = this.modeler.get('eventBus');
    eventBus.on('shape.remove', removeDecision);
    this.bpmnService.removeProcessPattern(this.modeler, subProcessElement);
    eventBus.off('shape.remove', removeDecision);
    this.saveDiagram(this.bmProcess.decisions);
  }

  openSelectDevelopmentMethodModal(taskElement) {
    this.selectDevelopmentMethodForm.get('developmentMethodId').disable();
    this.modalElement = taskElement;
    const types = this.bpmnService.getTypesOfActivity(this.modeler, taskElement.id);
    this.developmentMethodService.getValidDevelopmentMethods(
      types.neededType, types.forbiddenType,
    ).then((developmentMethods) => {
      this.validDevelopmentMethods = developmentMethods.docs;
      if (developmentMethods.docs.length > 0) {
        this.selectDevelopmentMethodForm.get('developmentMethodId').enable();
      }
    });
    this.modalReference = this.modalService.open(this.selectDevelopmentMethodModal, {size: 'lg'});
  }

  resetSelectDevelopmentMethodModal() {
    this.selectDevelopmentMethodForm.reset();
    this.validDevelopmentMethods = null;
    this.modalReference.close();
  }

  selectDevelopmentMethod(taskElement, selectDevelopmentMethodForm: FormGroup) {
    this.developmentMethodService.getDevelopmentMethod(selectDevelopmentMethodForm.value.developmentMethodId).then((developmentMethod) => {
      this.bpmnService.selectDevelopmentMethodForProcessTask(this.modeler, taskElement, developmentMethod);
      this.bmProcess.addDecision(taskElement.id, developmentMethod);
      this.saveDiagram(this.bmProcess.decisions);
    });
  }

  openMethodInfoModal(methodElement) {
    this.modalElement = methodElement;
    this.modalDevelopmentMethod = this.bmProcess.decisions[methodElement.id].method;
    this.modalReference = this.modalService.open(this.methodInfoModal, {size: 'lg'});
  }

  openProcessPatternInfoModal(processPatternElement) {
    this.modalElement = processPatternElement;
    this.processPatternService.getProcessPattern(processPatternElement.businessObject.get('processPatternId')).then(
      (pattern) => {
        this.modalProcessPattern = pattern;
        this.modalReference = this.modalService.open(this.patternInfoModal, {size: 'lg'});
      }
    );
  }

  openSelectProcessPatternModal(callActivityElement) {
    const types = this.bpmnService.getTypesOfActivity(this.modeler, callActivityElement.id);
    this.processPatternService.getValidProcessPatterns(
      [...types.neededType, {list: 'generic', element: null}], types.forbiddenType,
    ).then(list => {
      this.modalProcessPatterns = list.docs;
      this.modalElement = callActivityElement;
      this.modalReference = this.modalService.open(this.selectProcessPatternModal, {size: 'lg'});
    }).catch(
      error => console.log('OpenSelectProcessPatternModal: ' + error)
    );
  }

  selectProcessPattern(callActivityElement, selectProcessPatternForm: FormGroup) {
    this.modalReference.close();
    this.processPatternService.getProcessPattern(selectProcessPatternForm.value.processPatternId).then((processPattern) => {
      this.bpmnService.insertProcessPatternIntoCallActivity(this.modeler, callActivityElement, processPattern).then(() => {
        if (callActivityElement.businessObject.method) {
          this.bmProcess.removeDecision(callActivityElement.id);
          this.saveDiagram(this.bmProcess.decisions);
        } else {
          this.saveDiagram();
        }
      }).catch(
        error => console.log('SelectProcessPattern (inner): ' + error)
      );
    }).catch((error) => console.log('SelectProcessPattern: ' + error));
  }

  removeMethodFromTask(methodElement) {
    this.bpmnService.removeDevelopmentMethodFromProcessTask(this.modeler, methodElement);
    this.bmProcess.removeDecision(methodElement.id);
    this.saveDiagram(this.bmProcess.decisions);
  }

  checkWarnings() {
    if (this.isGeneratingWarnings) {
      this.wantsToGenerateWarnings = true;
      return;
    }
    this.isGeneratingWarnings = true;
    const missingWarnings: string[] = [];
    const lowWarnings: string[] = [];
    const incorrectWarnings: string[] = [];
    const generateWarnings =
      (element: { name: string, situationalFactors: { element: SituationalFactor }[] }, elementName: 'Method' | 'Pattern') => {
        const factorMap = SituationalFactor.createMap(element.situationalFactors.map((factor) => factor.element));
        const {missing, low, incorrect} = this.bmProcess.checkMatch(factorMap);
        missing.forEach((m) => missingWarnings.push(elementName + ' ' + element.name + ' is missing the factor ' + m + '.'));
        low.forEach((m) => lowWarnings.push(elementName + ' ' + element.name + ' has a too low value for the factor ' + m + '.'));
        incorrect.forEach((m) => incorrectWarnings.push(
          elementName + ' ' + element.name + ' has not the correct value for the factor ' + m + '.')
        );
      };
    const methodWarnings = this.developmentMethodService.getDevelopmentMethods(this.bpmnService.getUsedMethodIds(this.modeler)).then(
      (methods) => methods.forEach(
        (method) => generateWarnings(method, 'Method'),
      )
    );
    const patternWarnings = this.processPatternService.getProcessPatterns(this.bpmnService.getUsedPatternIds(this.modeler)).then(
      (patterns) => patterns.forEach(
        (pattern) => generateWarnings(pattern, 'Pattern'),
      )
    );
    Promise.all([methodWarnings, patternWarnings]).then(() => {
      if (!this.wantsToGenerateWarnings) {
        this.missingWarnings = missingWarnings;
        this.lowWarnings = lowWarnings;
        this.incorrectWarnings = incorrectWarnings;
      }
    }).finally(() => {
      this.isGeneratingWarnings = false;
      if (this.wantsToGenerateWarnings) {
        this.wantsToGenerateWarnings = false;
        this.checkWarnings();
      }
    });
  }

  updateDecisions(value: any) {
    this.bmProcess.decisions[this.modalElement.id].update(value);
    this.saveDiagram(this.bmProcess.decisions);
  }

  saveDiagram(decisions = null): Promise<void> {
    return this.modeler.saveXML().then(result => {
      if (decisions !== null) {
        this.saveBmProcess.emit({
          decisions,
          processDiagram: result.xml,
        });
      } else {
        this.saveBmProcess.emit({
          processDiagram: result.xml,
        });
      }
    });
  }

  diagramChanged(): Promise<boolean> {
    return this.modeler.saveXML().then((result) => result.xml !== this.bmProcess.processDiagram);
  }
}
