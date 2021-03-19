import { PouchdbModel } from '../database/pouchdb-model';
import { SituationalFactor } from './situational-factor';
import { DevelopmentMethod } from './development-method';
import { Decision, GroupSelection } from './decision';
import { Stakeholder } from './stakeholder';
import { Artifact } from './artifact';

export class BmProcess extends PouchdbModel {

  static readonly typeName = 'BmProcess';

  name: string;

  processDiagram: string;

  situationalFactors: { list: string, element: SituationalFactor }[] = [];

  decisions: { [elementId: string]: Decision } = {};

  constructor(bmProcess: Partial<BmProcess>) {
    super(BmProcess.typeName);
    this.update(bmProcess);
  }

  /**
   * Update this bm process with new values
   *
   * @param bmProcess the new values of this bm process (values will be copied to the current object)
   */
  update(bmProcess: Partial<BmProcess>) {
    Object.assign(this, bmProcess);
    this.situationalFactors = this.situationalFactors.map(
      (factor) => {
        return {
          list: factor.list,
          element: factor.element ? new SituationalFactor(factor.element) : null,
        };
      }
    );
    const decisions: { [elementId: string]: Decision } = {};
    Object.entries(this.decisions).forEach(([id, decision]) => {
      decisions[id] = new Decision(decision);
    });
    this.decisions = decisions;
  }

  /**
   * Check for match between context and given factors
   *
   * @param factorMap the given factors that should fulfill the context of this process
   * @returns factor names that are missing, have too low or incorrect values
   */
  checkMatch(factorMap: { [factorName: string]: string }): { missing: string[], low: string[], incorrect: string[] } {
    const result = {
      missing: [],
      low: [],
      incorrect: [],
    };
    this.situationalFactors.map((element) => element.element).forEach(
      (factor) => {
        if (!(factor.factor.name in factorMap)) {
          result.missing.push(factor.factor.name);
        } else if (factor.factor.ordered) {
          if (factor.factor.values.indexOf(factor.value) > factor.factor.values.indexOf(factorMap[factor.factor.name])) {
            result.low.push(factor.factor.name);
          }
        } else {
          if (factor.value !== factorMap[factor.factor.name]) {
            result.incorrect.push(factor.factor.name);
          }
        }
      }
    );
    return result;
  }

  addDecision(id: string, method: DevelopmentMethod) {
    this.decisions[id] = new Decision({
      method,
      stakeholders: new GroupSelection<Stakeholder>({}, null),
      inputArtifacts: new GroupSelection<Artifact>({}, null),
      outputArtifacts: new GroupSelection<Artifact>({}, null),
      tools: null,
    });
  }

  removeDecision(id: string) {
    delete this.decisions[id];
  }

  toPouchDb(): any {
    const decisions: { [elementId: string]: Decision } = {};
    Object.entries(this.decisions).forEach(([id, decision]) => {
      decisions[id] = decision.toPouchDb();
    });
    return {
      ...super.toPouchDb(),
      name: this.name,
      processDiagram: this.processDiagram,
      situationalFactors: this.situationalFactors.map((factor) => {
        return {
          list: factor.list,
          element: factor.element ? factor.element.toPouchDb() : null,
        };
      }),
      decisions,
    };
  }

}
