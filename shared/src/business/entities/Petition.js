const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { instantiateContacts } = require('./Contacts/PetitionContact');

// TODO: rename the folder Contacts to lower case contacts

const joi = require('joi-browser');

/**
 *
 * @param rawPetition
 * @constructor
 */
function Petition(rawPetition) {
  Object.assign(this, rawPetition);
  const contacts = instantiateContacts({
    partyType: this.partyType,
    contactInfo: {
      primary: this.contactPrimary,
      secondary: this.contactSecondary,
    },
  });
  this.contactPrimary = contacts.primary;
  this.contactSecondary = contacts.secondary;
}

Petition.errorToMessageMap = {
  caseType: 'Case Type is a required field.',
  hasIrsNotice: 'You must indicate whether you received an IRS notice.',
  irsNoticeDate: [
    {
      contains: 'must be less than or equal to',
      message: 'Notice Date is in the future. Please enter a valid date.',
    },
    'Notice Date is a required field.',
  ],
  partyType: 'Party Type is a required field.',
  petitionFile: 'The Petition file was not selected.',
  procedureType: 'Procedure Type is a required field.',
  filingType: 'Filing Type is a required field.',
  ownershipDisclosureFile: 'Ownership Disclosure Statement is required.',
  preferredTrialCity: 'Preferred Trial City is a required field.',
  signature: 'You must review the form before submitting.',
};

joiValidationDecorator(
  Petition,
  joi.object().keys({
    businessType: joi
      .string()
      .optional()
      .allow(null),
    caseType: joi.when('hasIrsNotice', {
      is: joi.exist(),
      then: joi.string().required(),
      otherwise: joi.optional().allow(null),
    }),
    filingType: joi.string().required(),
    hasIrsNotice: joi.boolean().required(),
    irsNoticeDate: joi
      .date()
      .iso()
      .max('now')
      .when('hasIrsNotice', {
        is: true,
        then: joi.required(),
        otherwise: joi.optional().allow(null),
      }),
    ownershipDisclosureFile: joi.object().when('filingType', {
      is: 'A business',
      then: joi.required(),
      otherwise: joi.optional().allow(null),
    }),
    countryType: joi.string().optional(), // TODO: this should probably be required, but set to optional for now
    partyType: joi.string().required(),
    petitionFile: joi.object().required(),
    preferredTrialCity: joi.string().required(),
    procedureType: joi.string().required(),
    signature: joi.boolean().required(),
  }),
  function() {
    return !this.getFormattedValidationErrors();
  },
  Petition.errorToMessageMap,
);

module.exports = Petition;
