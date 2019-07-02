const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} = require('../../../persistence/s3/getUploadPolicy');
const { ContactFactory } = require('../contacts/ContactFactory');

/**
 * CaseExternal Entity
 * Represents a Case with required documents that a Petitioner is attempting to add to the system.
 * @param rawCase
 * @constructor
 */
function CaseExternal(rawCase) {
  Object.assign(this, {
    businessType: rawCase.businessType,
    caseType: rawCase.caseType,
    contactPrimary: rawCase.contactPrimary,
    contactSecondary: rawCase.contactSecondary,
    countryType: rawCase.countryType,
    filingType: rawCase.filingType,
    hasIrsNotice: rawCase.hasIrsNotice,
    irsNoticeDate: rawCase.irsNoticeDate,
    ownershipDisclosureFile: rawCase.ownershipDisclosureFile,
    ownershipDisclosureFileSize: rawCase.ownershipDisclosureFileSize,
    partyType: rawCase.partyType,
    petitionFile: rawCase.petitionFile,
    petitionFileSize: rawCase.petitionFileSize,
    preferredTrialCity: rawCase.preferredTrialCity,
    procedureType: rawCase.procedureType,
    signature: rawCase.signature,
    stinFile: rawCase.stinFile,
    stinFileSize: rawCase.stinFileSize,
  });

  const contacts = ContactFactory.createContacts({
    contactInfo: {
      primary: this.contactPrimary,
      secondary: this.contactSecondary,
    },
    partyType: this.partyType,
  });
  this.contactPrimary = contacts.primary;
  this.contactSecondary = contacts.secondary;
}

CaseExternal.errorToMessageMap = {
  caseType: 'Case Type is a required field.',
  filingType: 'Filing Type is a required field.',
  hasIrsNotice: 'You must indicate whether you received an IRS notice.',
  irsNoticeDate: [
    {
      contains: 'must be less than or equal to',
      message: 'Notice Date is in the future. Please enter a valid date.',
    },
    'Notice Date is a required field.',
  ],
  ownershipDisclosureFile: 'Ownership Disclosure Statement is required.',
  ownershipDisclosureFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your Ownership Disclosure Statement file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your Ownership Disclosure Statement file size is empty.',
  ],
  partyType: 'Party Type is a required field.',
  petitionFile: 'The Petition file was not selected.',
  petitionFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your Petition file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your Petition file size is empty.',
  ],
  preferredTrialCity: 'Preferred Trial City is a required field.',
  procedureType: 'Procedure Type is a required field.',
  signature: 'You must review the form before submitting.',
  stinFile: 'Statement of Taxpayer Identification Number is required.',
  stinFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your STIN file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your STIN file size is empty.',
  ],
};

joiValidationDecorator(
  CaseExternal,
  joi.object().keys({
    businessType: joi
      .string()
      .optional()
      .allow(null),
    caseType: joi.when('hasIrsNotice', {
      is: joi.exist(),
      otherwise: joi.optional().allow(null),
      then: joi.string().required(),
    }),
    countryType: joi.string().optional(),
    filingType: joi.string().required(),
    hasIrsNotice: joi.boolean().required(),
    irsNoticeDate: joi
      .date()
      .iso()
      .max('now')
      .when('hasIrsNotice', {
        is: true,
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      }),
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
    preferredTrialCity: joi.string().required(),
    procedureType: joi.string().required(),
    signature: joi.boolean().required(),
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
  }),
  function() {
    return !this.getFormattedValidationErrors();
  },
  CaseExternal.errorToMessageMap,
);

module.exports = { CaseExternal };
