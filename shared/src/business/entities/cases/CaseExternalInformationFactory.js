const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const {
  MAX_FILE_SIZE_BYTES,
} = require('../../../persistence/s3/getUploadPolicy');
const { Case } = require('./Case');
const { ContactFactory } = require('../contacts/ContactFactory');

/**
 * CaseExternalInformationFactory Entity
 * Represents a Case that a Petitioner is attempting to add to the system via the File a Petition wizard.
 * Required fields are based on the user's current step in the wizard.
 * @param rawCase
 * @constructor
 */
function CaseExternalInformationFactory(rawCase) {
  this.businessType = rawCase.businessType;
  this.caseType = rawCase.caseType;
  this.contactPrimary = rawCase.contactPrimary;
  this.contactSecondary = rawCase.contactSecondary;
  this.countryType = rawCase.countryType;
  this.filingType = rawCase.filingType;
  this.hasIrsNotice = rawCase.hasIrsNotice;
  this.ownershipDisclosureFile = rawCase.ownershipDisclosureFile;
  this.ownershipDisclosureFileSize = rawCase.ownershipDisclosureFileSize;
  this.partyType = rawCase.partyType;
  this.petitionFile = rawCase.petitionFile;
  this.petitionFileSize = rawCase.petitionFileSize;
  this.preferredTrialCity = rawCase.preferredTrialCity;
  this.procedureType = rawCase.procedureType;
  this.signature = rawCase.signature;
  this.stinFile = rawCase.stinFile;
  this.stinFileSize = rawCase.stinFileSize;
  this.wizardStep = rawCase.wizardStep;

  if (+this.wizardStep >= 3) {
    const contacts = ContactFactory.createContacts({
      contactInfo: {
        primary: rawCase.contactPrimary,
        secondary: rawCase.contactSecondary,
      },
      partyType: rawCase.partyType,
    });
    this.contactPrimary = contacts.primary;
    this.contactSecondary = contacts.secondary;
  }
}

CaseExternalInformationFactory.errorToMessageMap = Case.COMMON_ERROR_MESSAGES;

const MAX_STEPS = 4;
const atWizardStep = (stepNum, schemaObj) => {
  const stepNumArray = [];
  for (let i = +stepNum; i <= MAX_STEPS; i++) {
    stepNumArray.push(`${i}`);
  }

  const generatedSchema = {};
  Object.keys(schemaObj).forEach(key => {
    generatedSchema[key] = joi.when('wizardStep', {
      is: joi.only(stepNumArray),
      otherwise: joi.optional().allow(null),
      then: schemaObj[key],
    });
  });
  return generatedSchema;
};

const wizardStep1 = atWizardStep(1, {
  stinFile: joi.object().required(),
  stinFileSize: joi.when('stinFile', {
    is: joi.exist(),
    otherwise: joi.optional().allow(null),
    then: joi
      .number()
      .required()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .integer(),
  }),
});

const wizardStep2 = atWizardStep(2, {
  caseType: joi.when('hasIrsNotice', {
    is: joi.exist(),
    otherwise: joi.optional().allow(null),
    then: joi.string().required(),
  }),
  hasIrsNotice: joi.boolean().required(),
  petitionFile: joi.object().required(),
  petitionFileSize: joi.when('petitionFile', {
    is: joi.exist(),
    otherwise: joi.optional().allow(null),
    then: joi
      .number()
      .required()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .integer(),
  }),
});

const wizardStep3 = atWizardStep(3, {
  businessType: joi
    .string()
    .optional()
    .allow(null),
  countryType: joi.string().optional(),
  filingType: joi.string().required(),
  ownershipDisclosureFile: joi.object().when('filingType', {
    is: 'A business',
    otherwise: joi.optional().allow(null),
    then: joi.required(),
  }),
  ownershipDisclosureFileSize: joi.when('ownershipDisclosureFile', {
    is: joi.exist(),
    otherwise: joi.optional().allow(null),
    then: joi
      .number()
      .required()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .integer(),
  }),
  partyType: joi.string().required(),
});

const wizardStep4 = atWizardStep(4, {
  preferredTrialCity: joi.string().required(),
  procedureType: joi.string().required(),
});

const schema = {
  wizardStep: joi.string().required(),
  ...wizardStep1,
  ...wizardStep2,
  ...wizardStep3,
  ...wizardStep4,
};

joiValidationDecorator(
  CaseExternalInformationFactory,
  joi.object().keys(schema),
  function() {
    return !this.getFormattedValidationErrors();
  },
  CaseExternalInformationFactory.errorToMessageMap,
);

module.exports = { CaseExternalInformationFactory };
