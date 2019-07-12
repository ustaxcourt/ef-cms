const joi = require('joi-browser');

const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

const ContactFactory = {};

ContactFactory.COUNTRY_TYPES = {
  DOMESTIC: 'domestic',
  INTERNATIONAL: 'international',
};

ContactFactory.PARTY_TYPES = {
  conservator: 'Conservator',
  corporation: 'Corporation',
  custodian: 'Custodian',
  donor: 'Donor',
  estate: 'Estate with an Executor/Personal Representative/Fiduciary/etc.',
  estateWithoutExecutor:
    'Estate without an Executor/Personal Representative/Fiduciary/etc.',
  guardian: 'Guardian',
  nextFriendForIncompetentPerson:
    'Next Friend for a Legally Incompetent Person (Without a Guardian, Conservator, or other like Fiduciary)',
  nextFriendForMinor:
    'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
  partnershipAsTaxMattersPartner: 'Partnership (as the tax matters partner)',
  partnershipBBA:
    'Partnership (as a partnership representative under the BBA regime)',
  partnershipOtherThanTaxMatters:
    'Partnership (as a partner other than tax matters partner)',
  petitioner: 'Petitioner',
  petitionerDeceasedSpouse: 'Petitioner & Deceased Spouse',
  petitionerSpouse: 'Petitioner & Spouse',
  survivingSpouse: 'Surviving Spouse',
  transferee: 'Transferee',
  trust: 'Trust',
};

ContactFactory.BUSINESS_TYPES = {
  corporation: ContactFactory.PARTY_TYPES.corporation,
  partnershipAsTaxMattersPartner:
    ContactFactory.PARTY_TYPES.partnershipAsTaxMattersPartner,
  partnershipBBA: ContactFactory.PARTY_TYPES.partnershipBBA,
  partnershipOtherThanTaxMatters:
    ContactFactory.PARTY_TYPES.partnershipOtherThanTaxMatters,
};

ContactFactory.ESTATE_TYPES = {
  estate: ContactFactory.PARTY_TYPES.estate,
  estateWithoutExecutor: ContactFactory.PARTY_TYPES.estateWithoutExecutor,
  trust: ContactFactory.PARTY_TYPES.trust,
};

ContactFactory.OTHER_TYPES = {
  conservator: ContactFactory.PARTY_TYPES.conservator,
  custodian: ContactFactory.PARTY_TYPES.custodian,
  guardian: ContactFactory.PARTY_TYPES.guardian,
  nextFriendForIncompetentPerson:
    ContactFactory.PARTY_TYPES.nextFriendForIncompetentPerson,
  nextFriendForMinor: ContactFactory.PARTY_TYPES.nextFriendForMinor,
};

const domesticErrorToMessageMap = {
  address1: 'Address is a required field.',
  city: 'City is a required field.',
  countryType: 'Country Type is a required field.',
  name: 'Name is a required field.',
  phone: 'Phone is a required field.',
  postalCode: [
    {
      contains: 'match',
      message: 'Please enter a valid zip code.',
    },
    'Zip Code is a required field.',
  ],
  state: 'State is a required field.',
};

const internationalErrorToMessageMap = {
  address1: 'Address is a required field.',
  city: 'City is a required field.',
  country: 'Country is a required field.',
  countryType: 'Country Type is a required field.',
  name: 'Name is a required field.',
  phone: 'Phone is a required field.',
  postalCode: 'Postal Code is a required field.',
  state: 'State/Province/Region is a required field.',
};

const commonValidationRequirements = {
  address1: joi.string().required(),
  address2: joi.string().optional(),
  address3: joi.string().optional(),
  city: joi.string().required(),
  name: joi.string().required(),
  phone: joi.string().required(),
};
const domesticValidationObject = {
  ...commonValidationRequirements,
  countryType: joi
    .string()
    .valid(ContactFactory.COUNTRY_TYPES.DOMESTIC)
    .required(),
  postalCode: joi
    .string()
    .regex(/^\d{5}(-\d{4})?$/)
    .required(),
  state: joi.string().required(),
};

const internationalValidationObject = {
  ...commonValidationRequirements,
  country: joi.string().required(),
  countryType: joi
    .string()
    .valid(ContactFactory.COUNTRY_TYPES.INTERNATIONAL)
    .required(),
  postalCode: joi.string().required(),
  state: joi.string().optional(),
};

/**
 * used for getting the joi validation object used for the different country type contacts.
 *
 * @param {options} options the options object
 * @param {options} options.countryType the country type of the contact
 * @returns {object} the joi validaiton object
 */
ContactFactory.getValidationObject = ({
  countryType = ContactFactory.COUNTRY_TYPES.DOMESTIC,
}) => {
  return countryType === ContactFactory.COUNTRY_TYPES.DOMESTIC
    ? domesticValidationObject
    : internationalValidationObject;
};

/**
 * used for getting the error message map object used for displaying errors
 *
 * @param {options} options the options object
 * @param {options} options.countryType the country type of the contact
 * @returns {object} the error message map object which maps errors to custom messages
 */
ContactFactory.getErrorToMessageMap = ({
  countryType = ContactFactory.COUNTRY_TYPES.DOMESTIC,
}) => {
  return countryType === ContactFactory.COUNTRY_TYPES.DOMESTIC
    ? domesticErrorToMessageMap
    : internationalErrorToMessageMap;
};

/**
 * used for getting the contact constructor depending on the party type and contact type
 *
 * @param {object} options the options object
 * @param {string} partyType see the PARTY_TYPES map for a list of all valid partyTypes
 * @param {string} countryType typically either 'domestic' or 'international'
 * @param {string} contactType typically either 'primary' or 'secondary'
 */
const getContactConstructor = ({ contactType, countryType, partyType }) => {
  const {
    getPetitionerConservatorContact,
  } = require('./PetitionerConservatorContact');
  const {
    getPetitionerCorporationContact,
  } = require('./PetitionerCorporationContact');
  const {
    getPetitionerCustodianContact,
  } = require('./PetitionerCustodianContact');
  const {
    getPetitionerDeceasedSpouseContact,
  } = require('./PetitionerDeceasedSpouseContact');
  const {
    getPetitionerEstateExecutorContact,
  } = require('./PetitionerEstateExecutorContact');
  const {
    getPetitionerEstateWithExecutorPrimaryContact,
  } = require('./PetitionerEstateWithExecutorPrimaryContact');
  const {
    getPetitionerGuardianContact,
  } = require('./PetitionerGuardianContact');
  const {
    getPetitionerIntermediaryContact,
  } = require('./PetitionerIntermediaryContact');
  const {
    getPetitionerPartnershipRepContact,
  } = require('./PetitionerPartnershipRepContact');
  const {
    getPetitionerTaxpayerContact,
  } = require('./PetitionerTaxpayerContact');
  const { getPetitionerPrimaryContact } = require('./PetitionerPrimaryContact');
  const { getPetitionerSpouseContact } = require('./PetitionerSpouseContact');
  const { getPetitionerTrustContact } = require('./PetitionerTrustContact');
  const { getPetitionerTrusteeContact } = require('./PetitionerTrusteeContact');
  return {
    [ContactFactory.PARTY_TYPES.petitioner]: {
      primary: getPetitionerPrimaryContact({ countryType }),
      secondary: null,
    }[contactType],
    [ContactFactory.PARTY_TYPES.transferee]: {
      primary: getPetitionerPrimaryContact({ countryType }),
      secondary: null,
    }[contactType],
    [ContactFactory.PARTY_TYPES.donor]: {
      primary: getPetitionerPrimaryContact({ countryType }),
      secondary: null,
    }[contactType],
    [ContactFactory.PARTY_TYPES.petitionerDeceasedSpouse]: {
      primary: getPetitionerPrimaryContact({ countryType }),
      secondary: getPetitionerDeceasedSpouseContact({ countryType }),
    }[contactType],
    [ContactFactory.PARTY_TYPES.survivingSpouse]: {
      primary: getPetitionerPrimaryContact({ countryType }),
      secondary: getPetitionerDeceasedSpouseContact({ countryType }),
    }[contactType],
    [ContactFactory.PARTY_TYPES.petitionerSpouse]: {
      primary: getPetitionerPrimaryContact({ countryType }),
      secondary: getPetitionerSpouseContact({ countryType }),
    }[contactType],
    [ContactFactory.PARTY_TYPES.corporation]: {
      primary: getPetitionerCorporationContact({ countryType }),
      secondary: null,
    }[contactType],
    [ContactFactory.PARTY_TYPES.estateWithoutExecutor]: {
      primary: getPetitionerIntermediaryContact({ countryType }),
      secondary: null,
    }[contactType],
    [ContactFactory.PARTY_TYPES.partnershipAsTaxMattersPartner]: {
      primary: getPetitionerPrimaryContact({ countryType }),
      secondary: getPetitionerIntermediaryContact({ countryType }),
    }[contactType],
    [ContactFactory.PARTY_TYPES.partnershipOtherThanTaxMatters]: {
      primary: getPetitionerPrimaryContact({ countryType }),
      secondary: getPetitionerIntermediaryContact({ countryType }),
    }[contactType],
    [ContactFactory.PARTY_TYPES.nextFriendForMinor]: {
      primary: getPetitionerPrimaryContact({ countryType }),
      secondary: getPetitionerIntermediaryContact({ countryType }),
    }[contactType],
    [ContactFactory.PARTY_TYPES.nextFriendForIncompetentPerson]: {
      primary: getPetitionerPrimaryContact({ countryType }),
      secondary: getPetitionerIntermediaryContact({ countryType }),
    }[contactType],
    [ContactFactory.PARTY_TYPES.estate]: {
      primary: getPetitionerEstateWithExecutorPrimaryContact({ countryType }),
      secondary: getPetitionerEstateExecutorContact({ countryType }),
    }[contactType],
    [ContactFactory.PARTY_TYPES.partnershipBBA]: {
      primary: getPetitionerIntermediaryContact({ countryType }),
      secondary: getPetitionerPartnershipRepContact({ countryType }),
    }[contactType],
    [ContactFactory.PARTY_TYPES.trust]: {
      primary: getPetitionerTrustContact({ countryType }),
      secondary: getPetitionerTrusteeContact({ countryType }),
    }[contactType],
    [ContactFactory.PARTY_TYPES.conservator]: {
      primary: getPetitionerTaxpayerContact({ countryType }),
      secondary: getPetitionerConservatorContact({ countryType }),
    }[contactType],
    [ContactFactory.PARTY_TYPES.guardian]: {
      primary: getPetitionerGuardianContact({ countryType }),
      secondary: getPetitionerTaxpayerContact({ countryType }),
    }[contactType],
    [ContactFactory.PARTY_TYPES.custodian]: {
      primary: getPetitionerCustodianContact({ countryType }),
      secondary: getPetitionerTaxpayerContact({ countryType }),
    }[contactType],
  }[partyType];
};

/**
 * used for instantiating the primary and secondary contact objects which are later used in the Petition entity.
 *
 * @param {object} options the options object
 * @param {string} partyType see the PARTY_TYPES map for a list of all valid partyTypes
 * @param {string} contactInfo object which should contain primary and secondary used for creating the contact entities
 * @returns {object} contains the primary and secondary contacts constructed
 */
ContactFactory.createContacts = ({ contactInfo, partyType }) => {
  const primaryConstructor = getContactConstructor({
    contactType: 'primary',
    countryType: (contactInfo.primary || {}).countryType,
    partyType,
  });
  const secondaryConstructor = getContactConstructor({
    contactType: 'secondary',
    countryType: (contactInfo.secondary || {}).countryType,
    partyType,
  });
  return {
    primary: primaryConstructor
      ? new primaryConstructor(contactInfo.primary || {})
      : {},
    secondary: secondaryConstructor
      ? new secondaryConstructor(contactInfo.secondary || {})
      : {},
  };
};

/**
 * creates a contact entities with additional error mappings and validation if needed.
 *
 * @param {object} options the options object
 * @param {object} options.additionalErrorMappings the error mappings object for any custom error messages or for overwriting existing ones
 * @param {object} options.additionalValidation the joi validation object that defines additional validations on top of the generic country type ones
 * @returns {Function} the entity constructor function
 */
ContactFactory.createContactFactory = ({
  additionalErrorMappings,
  additionalValidation,
}) => {
  return ({ countryType }) => {
    function GenericContactConstructor(rawContact) {
      Object.assign(this, {
        address1: rawContact.address1,
        address2: rawContact.address2 ? rawContact.address2 : undefined,
        address3: rawContact.address3 ? rawContact.address3 : undefined,
        city: rawContact.city,
        country: rawContact.country,
        countryType: rawContact.countryType,
        email: rawContact.email,
        inCareOf: rawContact.inCareOf,
        name: rawContact.name,
        phone: rawContact.phone,
        postalCode: rawContact.postalCode,
        state: rawContact.state,
        title: rawContact.title,
      });
    }

    GenericContactConstructor.errorToMessageMap = {
      ...ContactFactory.getErrorToMessageMap({ countryType }),
      ...additionalErrorMappings,
    };

    joiValidationDecorator(
      GenericContactConstructor,
      joi.object().keys({
        ...ContactFactory.getValidationObject({ countryType }),
        ...additionalValidation,
      }),
      undefined,
      GenericContactConstructor.errorToMessageMap,
    );

    return GenericContactConstructor;
  };
};

exports.ContactFactory = ContactFactory;
