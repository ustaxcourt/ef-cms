import {
  BUSINESS_TYPES,
  FILING_TYPES,
  LEGACY_TRIAL_CITY_STRINGS,
  PARTY_TYPES,
  PROCEDURE_TYPES,
  ROLES,
  TRIAL_CITY_STRINGS,
  TRIAL_LOCATION_MATCHER,
} from '@shared/business/entities/EntityConstants';
import { ContactFactory } from '../contacts/ContactFactory';
import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { getContactPrimary, getContactSecondary } from './Case';
import joi from 'joi';

export class CaseExternalIncomplete extends JoiValidationEntity {
  public businessType: string;
  public caseType: string;
  public countryType: string;
  public filingType: string;
  public hasIrsNotice: string;
  public partyType: string;
  public petitioners: any[];
  public preferredTrialCity: string;
  public procedureType: string;

  constructor(rawCase, { applicationContext }) {
    super('CaseExternalIncomplete');

    this.businessType = rawCase.businessType;
    this.caseType = rawCase.caseType;
    this.countryType = rawCase.countryType;
    this.filingType = rawCase.filingType;
    this.hasIrsNotice = rawCase.hasIrsNotice;
    this.partyType = rawCase.partyType;
    this.preferredTrialCity = rawCase.preferredTrialCity;
    this.procedureType = rawCase.procedureType;

    const contacts = ContactFactory({
      applicationContext,
      contactInfo: {
        primary: getContactPrimary(rawCase) || rawCase.contactPrimary,
        secondary: getContactSecondary(rawCase) || rawCase.contactSecondary,
      },
      partyType: rawCase.partyType,
    });
    this.petitioners = [];
    this.petitioners.push(contacts.primary);
    if (contacts.secondary) {
      this.petitioners.push(contacts.secondary);
    }
  }

  static VALIDATION_RULES = {
    businessType: JoiValidationConstants.STRING.valid(
      ...Object.values(BUSINESS_TYPES),
    )
      .optional()
      .allow(null),
    caseType: JoiValidationConstants.STRING.when('hasIrsNotice', {
      is: joi.exist(),
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    }).messages({ '*': 'Select a case type' }),
    countryType: JoiValidationConstants.STRING.optional(),
    filingType: JoiValidationConstants.STRING.valid(
      ...FILING_TYPES[ROLES.petitioner],
      ...FILING_TYPES[ROLES.privatePractitioner],
    )
      .required()
      .messages({ '*': 'Select on whose behalf you are filing' }),
    hasIrsNotice: joi
      .boolean()
      .required()
      .messages({ '*': 'Indicate whether you received an IRS notice' }),
    partyType: JoiValidationConstants.STRING.valid(
      ...Object.values(PARTY_TYPES),
    )
      .required()
      .messages({ '*': 'Select a party type' }),
    petitioners: joi
      .array()
      .description('List of Contact Entities for the case.')
      .optional(),
    preferredTrialCity: joi
      .alternatives()
      .try(
        JoiValidationConstants.STRING.valid(
          ...TRIAL_CITY_STRINGS,
          ...LEGACY_TRIAL_CITY_STRINGS,
          null,
        ),
        JoiValidationConstants.STRING.pattern(TRIAL_LOCATION_MATCHER), // Allow unique values for testing
      )
      .required()
      .messages({ '*': 'Select a trial location' }),
    procedureType: JoiValidationConstants.STRING.valid(...PROCEDURE_TYPES)
      .required()
      .messages({ '*': 'Select a case procedure' }),
  };

  getValidationRules() {
    return CaseExternalIncomplete.VALIDATION_RULES;
  }

  getContactPrimary() {
    return getContactPrimary(this);
  }

  getContactSecondary() {
    return getContactSecondary(this);
  }
}

export type RawCaseExternalIncomplete = ExcludeMethods<CaseExternalIncomplete>;
