const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { instantiateContacts } = require('./contacts/PetitionContact');

/**
 * PetitionWithoutFiles
 * Represents a Case without required documents that a Petitioner is attempting to add to the system.
 * After the Case's files have been saved, a Petition is created to include the document metadata.
 * @param rawPetition
 * @constructor
 */
function PetitionWithoutFiles(rawPetition) {
  Object.assign(this, {
    businessType: rawPetition.businessType,
    caseType: rawPetition.caseType,
    contactPrimary: rawPetition.contactPrimary,
    contactSecondary: rawPetition.contactSecondary,
    countryType: rawPetition.countryType,
    filingType: rawPetition.filingType,
    hasIrsNotice: rawPetition.hasIrsNotice,
    irsNoticeDate: rawPetition.irsNoticeDate,
    partyType: rawPetition.partyType,
    preferredTrialCity: rawPetition.preferredTrialCity,
    procedureType: rawPetition.procedureType,
  });

  const contacts = instantiateContacts({
    contactInfo: {
      primary: this.contactPrimary,
      secondary: this.contactSecondary,
    },
    partyType: this.partyType,
  });
  this.contactPrimary = contacts.primary;
  this.contactSecondary = contacts.secondary;
}

PetitionWithoutFiles.errorToMessageMap = {
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
  partyType: 'Party Type is a required field.',
  preferredTrialCity: 'Preferred Trial City is a required field.',
  procedureType: 'Procedure Type is a required field.',
};

joiValidationDecorator(
  PetitionWithoutFiles,
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
    partyType: joi.string().required(),
    preferredTrialCity: joi.string().required(),
    procedureType: joi.string().required(),
  }),
  function() {
    return !this.getFormattedValidationErrors();
  },
  PetitionWithoutFiles.errorToMessageMap,
);

module.exports = { PetitionWithoutFiles };
