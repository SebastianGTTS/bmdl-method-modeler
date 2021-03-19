import { DevelopmentMethod } from './development-method';
import { Artifact } from './artifact';
import { Stakeholder } from './stakeholder';
import { Tool } from './tool';
import { MethodElement } from './method-element';

export class GroupSelection<T extends MethodElement> {
  selectedGroup: number = null;
  elements: T[][] = null;

  constructor(groupSelection: Partial<GroupSelection<T>>, createElement: (element: Partial<T>) => T) {
    this.update(groupSelection, createElement);
  }

  update(groupSelection: Partial<GroupSelection<T>>, createElement: (element: Partial<T>) => T) {
    Object.assign(this, groupSelection);
    this.elements = this.elements
      ? this.elements.map((element) =>
        element
          ? element.map((e) =>
            e ? createElement(e) : null
          )
          : null
      )
      : null;
  }

  toPouchDb(): any {
    return {
      selectedGroup: this.selectedGroup,
      elements: this.elements
        ? this.elements.map((element) =>
          element
            ? element.map((e) =>
              e ? e.toPouchDb() : null
            )
            : null
        )
        : null,
    };
  }
}

export class Decision {

  method: DevelopmentMethod;
  inputArtifacts: GroupSelection<Artifact>;
  outputArtifacts: GroupSelection<Artifact>;
  stakeholders: GroupSelection<Stakeholder>;
  tools: Tool[][] = null;

  constructor(decision: Partial<Decision>) {
    this.update(decision);
  }

  update(decision: Partial<Decision>) {
    Object.assign(this, decision);
    this.method = new DevelopmentMethod(this.method);
    this.inputArtifacts = new GroupSelection<Artifact>(this.inputArtifacts, (artifact) => new Artifact(artifact));
    this.outputArtifacts = new GroupSelection<Artifact>(this.outputArtifacts, (artifact) => new Artifact(artifact));
    this.stakeholders = new GroupSelection<Stakeholder>(this.stakeholders, (stakeholder) => new Stakeholder(stakeholder));
    this.tools = this.tools ? this.tools.map((tool) => tool ? tool.map((t) => t ? new Tool(t) : null) : null) : null;
  }

  toPouchDb(): any {
    return {
      method: this.method.toPouchDb(),
      inputArtifacts: this.inputArtifacts.toPouchDb(),
      outputArtifacts: this.outputArtifacts.toPouchDb(),
      stakeholders: this.stakeholders.toPouchDb(),
      tools: this.tools ? this.tools.map((tool) => tool ? tool.map((t) => t ? t.toPouchDb() : null) : null) : null,
    };
  }

}
