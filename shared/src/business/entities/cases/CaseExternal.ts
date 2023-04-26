import {
  BUSINESS_TYPES,
  FILING_TYPES,
  LEGACY_TRIAL_CITY_STRINGS,
  PARTY_TYPES,
  PROCEDURE_TYPES,
  ROLES,
  TRIAL_CITY_STRINGS,
  TRIAL_LOCATION_MATCHER,
} from '../EntityConstants';
import { Case, getContactPrimary, getContactSecondary } from './Case';
import { ContactFactory } from '../contacts/ContactFactory';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { PDF } from '../documents/PDF';
import joi from 'joi';

/**
 * CaseExternal Entity
 * Represents a Case with required documents that a Petitioner is attempting to add to the system.
 *
 * @param {object} rawCase the raw case data
 * @constructor
 */
export class CaseExternal extends JoiValidationEntity {
  public businessType: string;
  public caseType: string;
  public corporateDisclosureFile?: object;
  public countryType: string;
  public filingType: string;
  public hasIrsNotice: boolean;
  public partyType: string;
  public petitioners: any;
  public petitionFile: object;
  public preferredTrialCity: string;
  public procedureType: string;
  public stinFile: object;

  constructor(rawCase) {
    super('CaseExternal');

    this.businessType = rawCase.businessType;
    this.caseType = rawCase.caseType;
    this.countryType = rawCase.countryType;
    this.filingType = rawCase.filingType;
    this.hasIrsNotice = rawCase.hasIrsNotice;
    this.partyType = rawCase.partyType;
    this.petitionFile = rawCase.petitionFile;
    this.preferredTrialCity = rawCase.preferredTrialCity;
    this.procedureType = rawCase.procedureType;
    this.stinFile = rawCase.stinFile;

    const contacts = ContactFactory.createContacts({
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

    if (rawCase.corporateDisclosureFile) {
      this.corporateDisclosureFile = new PDF({
        file: rawCase.corporateDisclosureFile,
        size: rawCase.corporateDisclosureFileSize,
      });
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
    corporateDisclosureFile: joi
      .object(PDF.VALIDATION_RULES)
      .when('filingType', {
        is: 'A business',
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
    petitionFile: joi.object(PDF.VALIDATION_RULES).required(),
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
    stinFile: joi.object(PDF.VALIDATION_RULES).required(),
  };

  static VALIDATION_ERROR_MESSAGES = Case.VALIDATION_ERROR_MESSAGES;

  getValidationRules() {
    return PDF.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return PDF.VALIDATION_ERROR_MESSAGES;
  }
}
