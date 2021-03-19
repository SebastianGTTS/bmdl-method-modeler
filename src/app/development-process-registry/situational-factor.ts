import { SituationalFactorDefinition } from './situational-factor-definition';

export class SituationalFactor {

  factor: SituationalFactorDefinition;
  value: string;

  /**
   * Create a map from situational factors
   *
   * @param situationalFactors the situational factors
   * @returns the situational factors map factor name to factor value
   */
  static createMap(situationalFactors: SituationalFactor[]): { [factorName: string]: string } {
    const factorMap = {};
    situationalFactors.forEach((factor) => factorMap[factor.factor.name] = factor.value);
    return factorMap;
  }

  constructor(situationalFactor: Partial<SituationalFactor>) {
    Object.assign(this, situationalFactor);
    this.factor = new SituationalFactorDefinition(this.factor);
  }

  toPouchDb(): any {
    return {
      factor: this.factor.toPouchDb(),
      value: this.value,
    };
  }

}
