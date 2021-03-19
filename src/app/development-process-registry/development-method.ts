import { PouchdbModel } from '../database/pouchdb-model';
import { Author } from '../model/author';
import { SituationalFactor } from './situational-factor';
import { Artifact } from './artifact';
import { Type } from './type';
import { Stakeholder } from './stakeholder';
import { Tool } from './tool';
import { MultipleSelection } from './multiple-selection';

export class DevelopmentMethod extends PouchdbModel {

  static readonly typeName = 'DevelopmentMethod';

  name: string;
  description: string;
  examples: string[] = [];
  author: Author;

  types: { list: string, element: Type }[] = [];
  situationalFactors: { list: string, element: SituationalFactor }[] = [];

  inputArtifacts: MultipleSelection<Artifact>[][] = [];
  outputArtifacts: MultipleSelection<Artifact>[][] = [];
  stakeholders: MultipleSelection<Stakeholder>[][] = [];
  tools: MultipleSelection<Tool>[] = [];

  constructor(developmentMethod: Partial<DevelopmentMethod>) {
    super(DevelopmentMethod.typeName);
    this.update(developmentMethod);
  }

  /**
   * Update this development method with new values
   *
   * @param developmentMethod the new values of this development method (values will be copied to the current object)
   */
  update(developmentMethod: Partial<DevelopmentMethod>) {
    Object.assign(this, developmentMethod);
    this.author = new Author(this.author);
    this.situationalFactors = this.situationalFactors.map(
      (factor) => {
        return {
          list: factor.list,
          element: factor.element ? new SituationalFactor(factor.element) : null,
        };
      }
    );
    this.inputArtifacts = this.inputArtifacts.map((group) =>
      group.map((artifact) =>
        new MultipleSelection<Artifact>(artifact, (a) => new Artifact(a))
      )
    );
    this.outputArtifacts = this.outputArtifacts.map((group) =>
      group.map((artifact) =>
        new MultipleSelection<Artifact>(artifact, (a) => new Artifact(a))
      )
    );
    this.stakeholders = this.stakeholders.map((group) =>
      group.map((stakeholder) =>
        new MultipleSelection<Stakeholder>(stakeholder, (s) => new Stakeholder(s))
      )
    );
    this.tools = this.tools.map((tool) => new MultipleSelection<Tool>(tool, (t) => new Tool(t)));
  }

  toPouchDb(): any {
    return {
      ...super.toPouchDb(),
      name: this.name,
      description: this.description,
      examples: this.examples,
      author: this.author.toPouchDb(),
      types: this.types,
      situationalFactors: this.situationalFactors.map((factor) => {
        return {
          list: factor.list,
          element: factor.element ? factor.element.toPouchDb() : null,
        };
      }),
      inputArtifacts: this.inputArtifacts.map((group) => group.map((artifact) => artifact.toPouchDb())),
      outputArtifacts: this.outputArtifacts.map((group) => group.map((artifact) => artifact.toPouchDb())),
      stakeholders: this.stakeholders.map((group) => group.map((element) => element.toPouchDb())),
      tools: this.tools.map((tool) => tool.toPouchDb()),
    };
  }

}
