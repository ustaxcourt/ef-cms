import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import joi from 'joi';

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

  static VALIDATION_RULES = {
    docketEntries: joi.array().max(0),
  };

  getValidationRules() {
    return RestrictedCase.VALIDATION_RULES;
  }
}
declare global {
  type RawRestrictedCase = Omit<
    ExcludeMethods<RestrictedCase>,
    'docketEntries'
  > & {
    docketEntries: RawDocketEntry[];
  };
}
