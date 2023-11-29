import { ContactFactory } from '../contacts/ContactFactory';
import { ElectronicPetition } from './ElectronicPetition';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { getContactPrimary, getContactSecondary } from './Case';
import joi from 'joi';

/**
 * CaseExternalInformationFactory Entity
 * Represents a Case that a Petitioner is attempting to add to the system via the File a Petition (now Create a Case) wizard.
 * Required fields are based on the user's current step in the wizard.
 */
export class CaseExternalInformationFactory extends JoiValidationEntity {
  private static MAX_STEPS = 4;

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
  public wizardStep: number;

  constructor(rawCase, { applicationContext }) {
    super('CaseExternalInformationFactory');

    this.businessType = rawCase.businessType;
    this.caseType = rawCase.caseType;
    this.corporateDisclosureFile = rawCase.corporateDisclosureFile;
    this.corporateDisclosureFileSize = rawCase.corporateDisclosureFileSize;
    this.countryType = rawCase.countryType;
    this.filingType = rawCase.filingType;
    this.hasIrsNotice = rawCase.hasIrsNotice;
    this.partyType = rawCase.partyType;
    this.petitionFile = rawCase.petitionFile;
    this.petitionFileSize = rawCase.petitionFileSize;
    this.preferredTrialCity = rawCase.preferredTrialCity;
    this.procedureType = rawCase.procedureType;
    this.stinFile = rawCase.stinFile;
    this.stinFileSize = rawCase.stinFileSize;
    this.wizardStep = rawCase.wizardStep;

    if (+this.wizardStep >= 3) {
      const contacts = ContactFactory({
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

  getValidationRules() {
    return CaseExternalInformationFactory.VALIDATION_RULES;
  }

  static atWizardStep(stepNum, schemaObj) {
    const stepNumArray: string[] = [];
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
      stinFile: ElectronicPetition.VALIDATION_RULES.stinFile,
      stinFileSize: ElectronicPetition.VALIDATION_RULES.stinFileSize,
    });
  }

  static wizardStep2() {
    return CaseExternalInformationFactory.atWizardStep(2, {
      caseType: ElectronicPetition.VALIDATION_RULES.caseType,
      hasIrsNotice: ElectronicPetition.VALIDATION_RULES.hasIrsNotice,
      petitionFile: ElectronicPetition.VALIDATION_RULES.petitionFile,
      petitionFileSize: ElectronicPetition.VALIDATION_RULES.petitionFileSize,
    });
  }

  static wizardStep3() {
    return CaseExternalInformationFactory.atWizardStep(3, {
      businessType: ElectronicPetition.VALIDATION_RULES.businessType,
      corporateDisclosureFile:
        ElectronicPetition.VALIDATION_RULES.corporateDisclosureFile,
      corporateDisclosureFileSize:
        ElectronicPetition.VALIDATION_RULES.corporateDisclosureFileSize,
      countryType: ElectronicPetition.VALIDATION_RULES.countryType,
      filingType: ElectronicPetition.VALIDATION_RULES.filingType,
      partyType: ElectronicPetition.VALIDATION_RULES.partyType,
    });
  }

  static wizardStep4() {
    return CaseExternalInformationFactory.atWizardStep(4, {
      preferredTrialCity:
        ElectronicPetition.VALIDATION_RULES.preferredTrialCity,
      procedureType: ElectronicPetition.VALIDATION_RULES.procedureType,
    });
  }
}
