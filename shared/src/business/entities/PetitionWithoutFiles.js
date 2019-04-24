const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { instantiateContacts } = require('./contacts/PetitionContact');

/**
 *
 * @param rawPetition
 * @constructor
 */
function PetitionWithoutFiles(rawPetition) {
  Object.assign(this, rawPetition);
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
  // ownershipDisclosureFile: 'Ownership Disclosure Statement is required.',
  partyType: 'Party Type is a required field.',
  // petitionFile: 'The Petition file was not selected.',
  preferredTrialCity: 'Preferred Trial City is a required field.',
  procedureType: 'Procedure Type is a required field.',
  // signature: 'You must review the form before submitting.',
  // stinFile: 'Statement of Taxpayer Identification Number is required.',
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
    // ownershipDisclosureFile: joi.object().when('filingType', {
    //   is: 'A business',
    //   otherwise: joi.optional().allow(null),
    //   then: joi.required(),
    // }),
    partyType: joi.string().required(),
    // petitionFile: joi.object().required(),
    preferredTrialCity: joi.string().required(),
    procedureType: joi.string().required(),
    // signature: joi.boolean().required(),
    // stinFile: joi.object().required(),
  }),
  function() {
    return !this.getFormattedValidationErrors();
  },
  PetitionWithoutFiles.errorToMessageMap,
);

module.exports = { PetitionWithoutFiles };
