import {
  BUSINESS_TYPES,
  FILING_TYPES,
  LEGACY_TRIAL_CITY_STRINGS,
  MAX_FILE_SIZE_BYTES,
  PARTY_TYPES,
  PROCEDURE_TYPES,
  ROLES,
  TRIAL_CITY_STRINGS,
  TRIAL_LOCATION_MATCHER,
} from '../EntityConstants';
import { Case, getContactPrimary, getContactSecondary } from './Case';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { createContacts } from '../contacts/ContactFactory';
import joi from 'joi';

/**
 * Represents a Case with required documents that a Petitioner is attempting to
 * add to the system.
 */
export class CaseExternal extends JoiValidationEntity {
  public businessType: string;
  public caseType: string;
  public corporateDisclosureFile?: object;
  public corporateDisclosureFileSize?: number;
  public countryType: string;
  public filingType: string;
  public hasIrsNotice: boolean;
  public partyType: string;
  public petitioners: any;
  public petitionFile?: object;
  public petitionFileSize?: number;
  public preferredTrialCity: string;
  public procedureType: string;
  public stinFile?: object;
  public stinFileSize?: number;

  constructor(rawCase, { applicationContext }) {
    super('CaseExternal');

    this.businessType = rawCase.businessType;
    this.caseType = rawCase.caseType;
    this.countryType = rawCase.countryType;
    this.filingType = rawCase.filingType;
    this.hasIrsNotice = rawCase.hasIrsNotice;
    this.partyType = rawCase.partyType;
    this.preferredTrialCity = rawCase.preferredTrialCity;
    this.procedureType = rawCase.procedureType;

    this.stinFile = rawCase.stinFile;
    this.stinFileSize = rawCase.stinFileSize;

    this.petitionFile = rawCase.petitionFile;
    this.petitionFileSize = rawCase.petitionFileSize;

    this.corporateDisclosureFile = rawCase.corporateDisclosureFile;
    this.corporateDisclosureFileSize = rawCase.corporateDisclosureFileSize;

    const contacts = createContacts({
      applicationContext,
      contactInfo: {
        primary: getContactPrimary(rawCase) || rawCase.contactPrimary,
        secondary: getContactSecondary(rawCase) || rawCase.contactSecondary,
      },
      partyType: rawCase.partyType,
    });

    this.petitioners = [contacts.primary];

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
    }),
    corporateDisclosureFile: joi.object().when('filingType', {
      is: 'A business',
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    }),
    corporateDisclosureFileSize: joi
      .number()
      .integer()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .when('corporateDisclosureFile', {
        is: joi.exist(),
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      }),
    countryType: JoiValidationConstants.STRING.optional(),
    filingType: JoiValidationConstants.STRING.valid(
      ...FILING_TYPES[ROLES.petitioner],
      ...FILING_TYPES[ROLES.privatePractitioner],
    ).required(),
    hasIrsNotice: joi.boolean().required(),
    partyType: JoiValidationConstants.STRING.valid(
      ...Object.values(PARTY_TYPES),
    ).required(),
    petitionFile: joi.object().required(),
    petitionFileSize: joi
      .number()
      .integer()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .when('petitionFile', {
        is: joi.exist(),
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      }),
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
      .required(),
    procedureType: JoiValidationConstants.STRING.valid(
      ...PROCEDURE_TYPES,
    ).required(),
    stinFile: joi.object().required(), // object of type File
    stinFileSize: joi
      .number()
      .integer()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .when('stinFile', {
        is: joi.exist(),
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      }),
  };

  static VALIDATION_ERROR_MESSAGES = Case.VALIDATION_ERROR_MESSAGES;

  getValidationRules() {
    return CaseExternal.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return CaseExternal.VALIDATION_ERROR_MESSAGES;
  }

  getContactPrimary() {
    return getContactPrimary(this);
  }

  getContactSecondary() {
    return getContactSecondary(this);
  }
}

export type RawCaseExternal = ExcludeMethods<CaseExternal>;
