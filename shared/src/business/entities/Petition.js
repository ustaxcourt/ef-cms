const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { instantiateContacts, DOMESTIC } = require('./Contacts/PetitionContact');

// TODO: rename the folder Contacts to lower case contacts

const joi = require('joi-browser');
const PetitionerPrimaryContact = require('./Contacts/PetitionerPrimaryContact');
const PetitionerCorporationContact = require('./Contacts/PetitionerCorporationContact');
const PetitionerIntermediaryContact = require('./Contacts/PetitionerIntermediaryContact');
const PetitionerDeceasedSpouseContact = require('./Contacts/PetitionerDeceasedSpouseContact');
const PetitionerSpouseContact = require('./Contacts/PetitionerSpouseContact');
const PetitionerEstateExecutorContact = require('./Contacts/PetitionerEstateExecutorContact');
const PetitionerEstateWithExecutorPrimaryContact = require('./Contacts/PetitionerEstateWithExecutorPrimaryContact');
const PetitionerTaxpayerContact = require('./Contacts/PetitionerTaxpayerContact');
const PetitionerGuardianContact = require('./Contacts/PetitionerGuardianContact');
const PetitionerCustodianContact = require('./Contacts/PetitionerCustodianContact');
const PetitionerPartnershipRepContact = require('./Contacts/PetitionerPartnershipRepContact');
const PetitionerTrustContact = require('./Contacts/PetitionerTrustContact');
const PetitionerTrusteeContact = require('./Contacts/PetitionerTrusteeContact');

/**
 *
 * @param rawPetition
 * @constructor
 */
function Petition(rawPetition) {
  Object.assign(this, rawPetition);

  let contacts;

  switch (this.partyType) {
    case 'Petitioner':
    case 'Transferee':
    case 'Donor':
      this.contactPrimary = new PetitionerPrimaryContact(
        this.contactPrimary || {},
      );
      break;
    case 'Petitioner & Deceased Spouse':
    case 'Surviving Spouse':
      this.contactPrimary = new PetitionerPrimaryContact(
        this.contactPrimary || {},
      );
      this.contactSecondary = new PetitionerDeceasedSpouseContact(
        this.contactSecondary || {},
      );
      break;
    case 'Petitioner & Spouse':
      this.contactPrimary = new PetitionerPrimaryContact(
        this.contactPrimary || {},
      );
      this.contactSecondary = new PetitionerSpouseContact(
        this.contactSecondary || {},
      );
      break;
    case 'Corporation':
      this.contactPrimary = new PetitionerCorporationContact(
        this.contactPrimary || {},
      );
      break;
    case 'Estate without an Executor/Personal Representative/Fiduciary/etc.':
      this.contactPrimary = new PetitionerIntermediaryContact(
        this.contactPrimary || {},
      );
      break;
    case 'Partnership (as the tax matters partner)':
    case 'Partnership (as a partner other than tax matters partner)':
      this.contactPrimary = new PetitionerPrimaryContact(
        this.contactPrimary || {},
      );
      this.contactSecondary = new PetitionerIntermediaryContact(
        this.contactSecondary || {},
      );
      break;
    case 'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)':
    case 'Next Friend for a Legally Incompetent Person (Without a Guardian, Conservator, or other like Fiduciary)':
      this.contactPrimary = new PetitionerPrimaryContact(
        this.contactPrimary || {},
      );
      this.contactSecondary = new PetitionerIntermediaryContact(
        this.contactSecondary || {},
      );
      break;
    case 'Estate with an Executor/Personal Representative/Fiduciary/etc.':
      this.contactPrimary = new PetitionerEstateWithExecutorPrimaryContact(
        this.contactPrimary || {},
      );
      this.contactSecondary = new PetitionerEstateExecutorContact(
        this.contactSecondary || {},
      );
      break;
    case 'Partnership (BBA Regime)':
      this.contactPrimary = new PetitionerIntermediaryContact(
        this.contactPrimary || {},
      );
      this.contactSecondary = new PetitionerPartnershipRepContact(
        this.contactSecondary || {},
      );
      break;
    case 'Trust':
      this.contactPrimary = new PetitionerTrustContact(
        this.contactPrimary || {},
      );
      this.contactSecondary = new PetitionerTrusteeContact(
        this.contactSecondary || {},
      );
      break;
    case 'Conservator':
      contacts = instantiateContacts({
        partyType: this.partyType,
        countryType: this.countryType || DOMESTIC,
        contactInfo: {
          primary: this.contactPrimary,
          secondary: this.contactSecondary,
        },
      });
      console.log('contacts', contacts);
      this.contactPrimary = contacts.primary;
      this.contactSecondary = contacts.secondary;
      break;
    case 'Guardian':
      this.contactPrimary = new PetitionerGuardianContact(
        this.contactPrimary || {},
      );
      this.contactSecondary = new PetitionerTaxpayerContact(
        this.contactSecondary || {},
      );
      break;
    case 'Custodian':
      this.contactPrimary = new PetitionerCustodianContact(
        this.contactPrimary || {},
      );
      this.contactSecondary = new PetitionerTaxpayerContact(
        this.contactSecondary || {},
      );
      break;
  }
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
    countryType: joi.string().required(),
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
