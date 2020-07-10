const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { Case } = require('./Case');
const { CaseExternal } = require('./CaseExternal');

/**
 * CaseExternalInformationFactory Entity
 * Represents a Case that a Petitioner is attempting to add to the system via the File a Petition (now Create a Case) wizard.
 * Required fields are based on the user's current step in the wizard.
 *
 * @param {object} rawCase the raw case data
 * @constructor
 */
function CaseExternalInformationFactory(rawCase) {
  CaseExternal.prototype.init.call(this, rawCase);
  this.wizardStep = rawCase.wizardStep;

  if (+this.wizardStep >= 3) {
    CaseExternal.prototype.initContacts.call(this, rawCase);
  }
}

CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES =
  Case.VALIDATION_ERROR_MESSAGES;

const MAX_STEPS = 4;
const atWizardStep = (stepNum, schemaObj) => {
  const stepNumArray = [];
  for (let i = +stepNum; i <= MAX_STEPS; i++) {
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
};

const wizardStep1 = atWizardStep(1, {
  stinFile: CaseExternal.commonRequirements.stinFile,
  stinFileSize: CaseExternal.commonRequirements.stinFileSize,
});

const wizardStep2 = atWizardStep(2, {
  caseType: CaseExternal.commonRequirements.caseType,
  hasIrsNotice: CaseExternal.commonRequirements.hasIrsNotice,
  petitionFile: CaseExternal.commonRequirements.petitionFile,
  petitionFileSize: CaseExternal.commonRequirements.petitionFileSize,
});

const wizardStep3 = atWizardStep(3, {
  businessType: CaseExternal.commonRequirements.businessType,
  countryType: CaseExternal.commonRequirements.countryType,
  filingType: CaseExternal.commonRequirements.filingType,
  ownershipDisclosureFile:
    CaseExternal.commonRequirements.ownershipDisclosureFile,
  ownershipDisclosureFileSize:
    CaseExternal.commonRequirements.ownershipDisclosureFileSize,
  partyType: CaseExternal.commonRequirements.partyType,
});

const wizardStep4 = atWizardStep(4, {
  preferredTrialCity: CaseExternal.commonRequirements.preferredTrialCity,
  procedureType: CaseExternal.commonRequirements.procedureType,
});

const schema = {
  wizardStep: joi.string().valid('1', '2', '3', '4').required(),
  ...wizardStep1,
  ...wizardStep2,
  ...wizardStep3,
  ...wizardStep4,
};

joiValidationDecorator(
  CaseExternalInformationFactory,
  joi.object().keys(schema),
  CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES,
);

module.exports = { CaseExternalInformationFactory };
