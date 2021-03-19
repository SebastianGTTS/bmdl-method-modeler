import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BmProcessComponent } from './bm-process/bm-process.component';
import { BmProcessDiagramComponent } from './bm-process-diagram/bm-process-diagram.component';
import { BmProcessesComponent } from './bm-processes/bm-processes.component';
import { DevelopmentMethodComponent } from './development-method/development-method.component';
import { DevelopmentMethodsComponent } from './development-methods/development-methods.component';
import { DevelopmentProcessesRoutingModule } from './development-processes-routing.module';
import { ProcessPatternComponent } from './process-pattern/process-pattern.component';
import { ProcessPatternDiagramComponent } from './process-pattern-diagram/process-pattern-diagram.component';
import { ProcessPatternTypesFormComponent } from './process-pattern-types-form/process-pattern-types-form.component';
import { ProcessPatternsComponent } from './process-patterns/process-patterns.component';
import { SelectProcessPatternFormComponent } from './select-process-pattern-form/select-process-pattern-form.component';
import { ConfirmLeaveModalComponent } from './confirm-leave-modal/confirm-leave-modal.component';
import { SituationalFactorsComponent } from './situational-factors/situational-factors.component';
import { SituationalFactorComponent } from './situational-factor/situational-factor.component';
import { MethodElementListComponent } from './method-element-list/method-element-list.component';
import { MethodElementFormComponent } from './method-element-form/method-element-form.component';
import { ArtifactsComponent } from './artifacts/artifacts.component';
import { ArtifactComponent } from './artifact/artifact.component';
import { StakeholdersComponent } from './stakeholders/stakeholders.component';
import { StakeholderComponent } from './stakeholder/stakeholder.component';
import { ToolComponent } from './tool/tool.component';
import { ToolsComponent } from './tools/tools.component';
import { TypesComponent } from './types/types.component';
import { TypeComponent } from './type/type.component';
import { MethodElementSelectionFormComponent } from './method-element-selection-form/method-element-selection-form.component';
import { MethodElementsSelectionFormComponent } from './method-elements-selection-form/method-elements-selection-form.component';
import { TypesSelectionFormComponent } from './types-selection-form/types-selection-form.component';
import {
  SituationalFactorsSelectionFormComponent
} from './situational-factors-selection-form/situational-factors-selection-form.component';
import { SituationalFactorSelectionFormComponent } from './situational-factor-selection-form/situational-factor-selection-form.component';
import { ArtifactsSelectionFormComponent } from './artifacts-selection-form/artifacts-selection-form.component';
import { StakeholdersSelectionFormComponent } from './stakeholders-selection-form/stakeholders-selection-form.component';
import { ToolsSelectionFormComponent } from './tools-selection-form/tools-selection-form.component';
import { ExamplesFormComponent } from './examples-form/examples-form.component';
import { MethodInfoComponent } from './method-info/method-info.component';
import { MethodElementGroupInfoComponent } from './method-element-group-info/method-element-group-info.component';
import { MethodElementInfoComponent } from './method-element-info/method-element-info.component';
import { ArtifactsGroupInfoComponent } from './artifacts-group-info/artifacts-group-info.component';
import { StakeholdersGroupInfoComponent } from './stakeholders-group-info/stakeholders-group-info.component';
import { ToolsInfoComponent } from './tools-info/tools-info.component';


@NgModule({
  declarations: [
    BmProcessComponent,
    BmProcessDiagramComponent,
    BmProcessesComponent,
    DevelopmentMethodComponent,
    DevelopmentMethodsComponent,
    ProcessPatternComponent,
    ProcessPatternDiagramComponent,
    ProcessPatternTypesFormComponent,
    ProcessPatternsComponent,
    SelectProcessPatternFormComponent,
    ConfirmLeaveModalComponent,
    SituationalFactorsComponent,
    SituationalFactorComponent,
    MethodElementListComponent,
    MethodElementFormComponent,
    ArtifactsComponent,
    ArtifactComponent,
    StakeholdersComponent,
    StakeholderComponent,
    ToolComponent,
    ToolsComponent,
    TypesComponent,
    TypeComponent,
    MethodElementSelectionFormComponent,
    MethodElementsSelectionFormComponent,
    TypesSelectionFormComponent,
    SituationalFactorsSelectionFormComponent,
    SituationalFactorSelectionFormComponent,
    ArtifactsSelectionFormComponent,
    StakeholdersSelectionFormComponent,
    ToolsSelectionFormComponent,
    ExamplesFormComponent,
    MethodInfoComponent,
    MethodElementGroupInfoComponent,
    MethodElementInfoComponent,
    ArtifactsGroupInfoComponent,
    StakeholdersGroupInfoComponent,
    ToolsInfoComponent,
  ],
  entryComponents: [ConfirmLeaveModalComponent],
  imports: [
    DevelopmentProcessesRoutingModule,
    SharedModule,
  ]
})
export class DevelopmentProcessesModule {
}
