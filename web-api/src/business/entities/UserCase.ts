import { Case } from '@shared/business/entities/cases/Case';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';

export class UserCase extends JoiValidationEntity {
  public docketNumber: string;

  constructor(rawUserCase: RawUserCase) {
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
