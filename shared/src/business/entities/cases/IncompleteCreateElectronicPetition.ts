import { ContactFactory } from '../contacts/ContactFactory';
import { IncompleteEditElectronicPetition } from './IncompleteEditElectronicPetition';
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
  public preferredTrialCity: string;
  public procedureType: string;
  public petitioners: any[];

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
    businessType:
      IncompleteEditElectronicPetition.VALIDATION_RULES.businessType,
    caseType: IncompleteEditElectronicPetition.VALIDATION_RULES.caseType,
    countryType: IncompleteEditElectronicPetition.VALIDATION_RULES.countryType,
    filingType: IncompleteEditElectronicPetition.VALIDATION_RULES.filingType,
    hasIrsNotice:
      IncompleteEditElectronicPetition.VALIDATION_RULES.hasIrsNotice,
    partyType: IncompleteEditElectronicPetition.VALIDATION_RULES.partyType,
    petitioners: joi
      .array()
      .description('List of Contact Entities for the case.')
      .optional(),
    preferredTrialCity:
      IncompleteEditElectronicPetition.VALIDATION_RULES.preferredTrialCity,
    procedureType:
      IncompleteEditElectronicPetition.VALIDATION_RULES.procedureType,
  } as const;

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
