const joi = require('joi-browser');

// const PetitionerPrimaryContact = require('./Contacts/PetitionerPrimaryContact');
// const PetitionerCorporationContact = require('./Contacts/PetitionerCorporationContact');
// const PetitionerIntermediaryContact = require('./Contacts/PetitionerIntermediaryContact');
// const PetitionerDeceasedSpouseContact = require('./Contacts/PetitionerDeceasedSpouseContact');
// const PetitionerSpouseContact = require('./Contacts/PetitionerSpouseContact');
// const PetitionerEstateExecutorContact = require('./Contacts/PetitionerEstateExecutorContact');
// const PetitionerEstateWithExecutorPrimaryContact = require('./Contacts/PetitionerEstateWithExecutorPrimaryContact');
// const PetitionerGuardianContact = require('./Contacts/PetitionerGuardianContact');
// const PetitionerCustodianContact = require('./Contacts/PetitionerCustodianContact');
// const PetitionerPartnershipRepContact = require('./Contacts/PetitionerPartnershipRepContact');
// const PetitionerTrustContact = require('./Contacts/PetitionerTrustContact');
// const PetitionerTrusteeContact = require('./Contacts/PetitionerTrusteeContact');

const usErrorToMessageMap = {
  name: 'Name is a required field.',
  address1: 'Address is a required field.',
  city: 'City is a required field.',
  state: 'State is a required field.',
  zip: 'Zip Code is a required field.',
  phone: 'Phone is a required field.',
};

const usValidationObject = {
  name: joi.string().required(),
  address1: joi.string().required(),
  city: joi.string().required(),
  state: joi.string().required(),
  zip: joi.string().required(),
  phone: joi.string().required(),
};

exports.DOMESTIC = 'domestic';
exports.INTERNATIONAL = 'international';

exports.PARTY_TYPES = {
  conservator: 'Conservator',
};

// TODO: maybe export the states here?

exports.getValidationObject = ({ countryType = exports.DOMESTIC }) => {
  return countryType === exports.DOMESTIC
    ? usValidationObject
    : usValidationObject;
};

exports.getErrorToMessageMap = ({ countryType = exports.DOMESTIC }) => {
  return countryType === exports.DOMESTIC
    ? usErrorToMessageMap
    : usErrorToMessageMap;
};

const getContactConstructor = ({ partyType, countryType, contactType }) => {
  const {
    getPetitionerTaxpayerContact,
  } = require('./PetitionerTaxpayerContact');
  const {
    getPetitionerConservatorContact,
  } = require('./PetitionerConservatorContact');
  console.log('partyType', partyType);
  console.log('countryType', countryType);
  console.log('contactType', contactType);
  console.log(getPetitionerConservatorContact({ countryType }));
  console.log(getPetitionerTaxpayerContact({ countryType }));
  return {
    [exports.PARTY_TYPES.conservator]: {
      primary: getPetitionerConservatorContact({ countryType }),
      secondary: getPetitionerTaxpayerContact({ countryType }),
    }[contactType],
  }[partyType];
};

exports.instantiateContacts = ({ partyType, countryType, contactInfo }) => {
  const primaryConstructor = getContactConstructor({
    partyType,
    countryType,
    contactType: 'primary',
  });
  const secondaryConstructor = getContactConstructor({
    partyType,
    countryType,
    contactType: 'primary',
  });
  return {
    primary: new primaryConstructor(contactInfo.primary || {}),
    secondary: new secondaryConstructor(contactInfo.secondary || {}),
  };
};
