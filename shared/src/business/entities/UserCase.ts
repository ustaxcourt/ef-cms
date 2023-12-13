import { Case } from './cases/Case';
import { ExcludeMethods } from 'types/TEntity';
import { JoiValidationEntity } from './JoiValidationEntity';

export class UserCase extends JoiValidationEntity {
  public docketNumber: string;

  constructor(rawUserCase) {
    super('UserCase');

    this.docketNumber = rawUserCase.docketNumber;
  }

  getValidationRules() {
    return {
      docketNumber: Case.VALIDATION_RULES.docketNumber,
    };
  }
}

export type RawUserCase = ExcludeMethods<UserCase>;
