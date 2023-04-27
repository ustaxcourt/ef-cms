import { Case, getContactPrimary, getContactSecondary } from './Case';
import { CaseExternal } from './CaseExternal';
import { ContactFactory } from '../contacts/ContactFactory';
import { JoiValidationEntity } from '../JoiValidationEntity';
import joi from 'joi';

/**
 * Represents a case without required documents that a Petitioner is attempting
 *  to add to the system. After the case's files have been saved, a Petition is
 *  created to include the document metadata.
 */
export class CaseExternalIncomplete extends JoiValidationEntity {
  public businessType: string;
  public caseType: string;
  public countryType: string;
  public filingType: string;
  public hasIrsNotice: boolean;
  public partyType: string;
  public petitioners: any;
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
  }

  static VALIDATION_RULES = {
    businessType: CaseExternal.VALIDATION_RULES.businessType,
    caseType: CaseExternal.VALIDATION_RULES.caseType,
    countryType: CaseExternal.VALIDATION_RULES.countryType,
    filingType: CaseExternal.VALIDATION_RULES.filingType,
    hasIrsNotice: CaseExternal.VALIDATION_RULES.hasIrsNotice,
    partyType: CaseExternal.VALIDATION_RULES.partyType,
    petitioners: joi
      .array()
      .description('List of Petitioner Entities for the case.')
      .optional(),
    preferredTrialCity: CaseExternal.VALIDATION_RULES.preferredTrialCity,
    procedureType: CaseExternal.VALIDATION_RULES.procedureType,
  };

  static VALIDATION_ERROR_MESSAGES = Case.VALIDATION_ERROR_MESSAGES;

  getValidationRules() {
    return CaseExternalIncomplete.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return CaseExternalIncomplete.VALIDATION_ERROR_MESSAGES;
  }

  getContactPrimary = function () {
    return getContactPrimary(this);
  };

  getContactSecondary = function () {
    return getContactSecondary(this);
  };
}
