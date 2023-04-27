import { Case, getContactPrimary, getContactSecondary } from './Case';
import { CaseExternal } from './CaseExternal';
import { ContactFactory } from '../contacts/ContactFactory';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { PDF } from '../documents/PDF';
import joi from 'joi';

/**
 * CaseExternalInformationFactory Entity
 * Represents a Case that a Petitioner is attempting to add to the system via the File a Petition (now Create a Case) wizard.
 * Required fields are based on the user's current step in the wizard.
 *
 * @param {object} rawCase the raw case data
 * @constructor
 */
export class CaseExternalInformationFactory extends JoiValidationEntity {
  private static MAX_STEPS = 4;

  public businessType: string;
  public caseType: string;
  public corporateDisclosureFile?: object;
  public countryType: string;
  public filingType: string;
  public hasIrsNotice: boolean;
  public partyType: string;
  public petitioners: any;
  public petitionFile?: object;
  public preferredTrialCity: string;
  public procedureType: string;
  public stinFile?: object;
  public wizardStep: any;

  constructor(rawCase, { applicationContext }) {
    super('CaseExternalInformationFactory');

    this.businessType = rawCase.businessType;
    this.caseType = rawCase.caseType;
    this.countryType = rawCase.countryType;
    this.filingType = rawCase.filingType;
    this.hasIrsNotice = rawCase.hasIrsNotice;
    this.partyType = rawCase.partyType;
    this.preferredTrialCity = rawCase.preferredTrialCity;
    this.procedureType = rawCase.procedureType;
    this.wizardStep = rawCase.wizardStep;

    if (rawCase.stinFile) {
      this.stinFile = new PDF({
        file: rawCase.stinFile,
        size: rawCase.stinFileSize,
      });
    }

    if (rawCase.petitionFile) {
      this.petitionFile = new PDF({
        file: rawCase.petitionFile,
        size: rawCase.petitionFileSize,
      });
    }

    if (rawCase.corporateDisclosureFile) {
      this.corporateDisclosureFile = new PDF({
        file: rawCase.corporateDisclosureFile,
        size: rawCase.corporateDisclosureFileSize,
      });
    }

    if (+this.wizardStep >= 3) {
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
  }

  static VALIDATION_RULES = {
    wizardStep: JoiValidationConstants.STRING.valid(
      '1',
      '2',
      '3',
      '4',
    ).required(),
    ...CaseExternalInformationFactory.wizardStep1(),
    ...CaseExternalInformationFactory.wizardStep2(),
    ...CaseExternalInformationFactory.wizardStep3(),
    ...CaseExternalInformationFactory.wizardStep4(),
  };

  static VALIDATION_ERROR_MESSAGES = Case.VALIDATION_ERROR_MESSAGES;

  getValidationRules() {
    return CaseExternalInformationFactory.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES;
  }

  static atWizardStep(stepNum, schemaObj) {
    const stepNumArray = [];
    for (let i = +stepNum; i <= CaseExternalInformationFactory.MAX_STEPS; i++) {
      stepNumArray.push(`${i}`);
    }

    const generatedSchema = {};
    Object.keys(schemaObj).forEach(key => {
      generatedSchema[key] = joi.when('wizardStep', {
        is: joi.valid(...stepNumArray),
        otherwise: joi.optional().allow(null),
        then: schemaObj[key],
      });
    });
    return generatedSchema;
  }

  static wizardStep1() {
    return CaseExternalInformationFactory.atWizardStep(1, {
      stinFile: CaseExternal.VALIDATION_RULES.stinFile,
    });
  }

  static wizardStep2() {
    return CaseExternalInformationFactory.atWizardStep(2, {
      caseType: CaseExternal.VALIDATION_RULES.caseType,
      hasIrsNotice: CaseExternal.VALIDATION_RULES.hasIrsNotice,
      petitionFile: CaseExternal.VALIDATION_RULES.petitionFile,
    });
  }

  static wizardStep3() {
    return CaseExternalInformationFactory.atWizardStep(3, {
      businessType: CaseExternal.VALIDATION_RULES.businessType,
      corporateDisclosureFile:
        CaseExternal.VALIDATION_RULES.corporateDisclosureFile,
      countryType: CaseExternal.VALIDATION_RULES.countryType,
      filingType: CaseExternal.VALIDATION_RULES.filingType,
      partyType: CaseExternal.VALIDATION_RULES.partyType,
    });
  }

  static wizardStep4() {
    return CaseExternalInformationFactory.atWizardStep(4, {
      preferredTrialCity: CaseExternal.VALIDATION_RULES.preferredTrialCity,
      procedureType: CaseExternal.VALIDATION_RULES.procedureType,
    });
  }
}
