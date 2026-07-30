import { RestrictedCase } from '@shared/business/entities/cases/RestrictedCase';
import { removeServedParties } from '../helpers/removeServedParties';
import {
  CASE_DOCKET_NUMBER_RULE,
  CASE_DOCKET_NUMBER_WITH_SUFFIX_RULE,
  CASE_IS_SEALED_RULE,
  CASE_LEAD_DOCKET_NUMBER_RULE,
} from '@shared/business/entities/EntityValidationConstants';
import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import joi from 'joi';

export class RestrictedCaseResponse extends JoiValidationEntity {
  public docketNumber: string;
  public docketNumberSuffix?: string;
  public docketNumberWithSuffix?: string;
  public isPaper?: boolean;
  public isSealed?: string;
  public leadDocketNumber?: string;
  public docketEntries: RawDocketEntry[];

  constructor(rawRestrictedCase: RawRestrictedCase) {
    super('RestrictedCaseResponse');
    rawRestrictedCase = new RestrictedCase(rawRestrictedCase).toRawObject();
    this.docketNumber = rawRestrictedCase.docketNumber;
    this.docketNumberSuffix = rawRestrictedCase.docketNumberSuffix;
    this.docketNumberWithSuffix = rawRestrictedCase.docketNumberWithSuffix;
    this.isPaper = rawRestrictedCase.isPaper;
    this.isSealed = rawRestrictedCase.isSealed;
    this.leadDocketNumber = rawRestrictedCase.leadDocketNumber;
    this.docketEntries = removeServedParties(rawRestrictedCase.docketEntries);
  }

  static VALIDATION_RULES = {
    docketEntries: joi.array().required(),
    docketNumber: CASE_DOCKET_NUMBER_RULE,
    docketNumberSuffix: JoiValidationConstants.STRING.optional().allow(null),
    docketNumberWithSuffix: CASE_DOCKET_NUMBER_WITH_SUFFIX_RULE.optional(),
    isPaper: joi.boolean().optional(),
    isSealed: CASE_IS_SEALED_RULE,
    leadDocketNumber: CASE_LEAD_DOCKET_NUMBER_RULE,
  };

  getValidationRules() {
    return RestrictedCaseResponse.VALIDATION_RULES;
  }
}
