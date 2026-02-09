import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import joi from 'joi';
import { Case } from './Case';
import { JoiValidationConstants } from '../JoiValidationConstants';

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
    docketEntries: joi
      .array()
      .max(0)
      .description('Restricted case cannot have docket entries.'),
    docketNumber: JoiValidationConstants.DOCKET_NUMBER.optional().description(
      'Unique case identifier in XXXXX-YY format.',
    ),
  };

  getValidationRules() {
    const caseRules = Case.VALIDATION_RULES;
    const { docketNumberSuffix, isPaper, isSealed, leadDocketNumber } =
      caseRules;
    return {
      docketNumberSuffix,
      isPaper,
      isSealed,
      leadDocketNumber,
      ...RestrictedCase.VALIDATION_RULES,
    };
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
