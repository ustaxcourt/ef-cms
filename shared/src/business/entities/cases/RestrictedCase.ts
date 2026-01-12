import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';

// An entity for case details for a case a user does not have access to
export class RestrictedCase extends JoiValidationEntity {
  public docketNumber?: string;
  public docketNumberSuffix?: string;
  public isPaper?: boolean;
  public isSealed?: string;
  public leadDocketNumber?: boolean;
  public docketEntries: DocketEntry[];

  constructor(rawCase: any) {
    super('RestrictedCase');
    this.docketNumber = rawCase.docketNumber;
    this.docketNumberSuffix = rawCase.docketNumberSuffix;
    this.isPaper = rawCase.isPaper;
    this.isSealed = rawCase.isSealed;
    this.leadDocketNumber = rawCase.leadDocketNumber;
    this.docketEntries = [];
  }

  getValidationRules() {
    return Case.VALIDATION_RULES;
  }
}
