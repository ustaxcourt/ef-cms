const joi = require('joi-browser');

const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');

const ContactFactory = {};

ContactFactory.COUNTRY_TYPES = {
  DOMESTIC: 'domestic',
  INTERNATIONAL: 'international',
};

ContactFactory.US_STATES = {
  AK: 'Alaska',
  AL: 'Alabama',
  AR: 'Arkansas',
  AZ: 'Arizona',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DC: 'District of Columbia',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  IA: 'Iowa',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  MA: 'Massachusetts',
  MD: 'Maryland',
  ME: 'Maine',
  MI: 'Michigan',
  MN: 'Minnesota',
  MO: 'Missouri',
  MS: 'Mississippi',
  MT: 'Montana',
  NC: 'North Carolina',
  ND: 'North Dakota',
  NE: 'Nebraska',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NV: 'Nevada',
  NY: 'New York',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VA: 'Virginia',
  VT: 'Vermont',
  WA: 'Washington',
  WI: 'Wisconsin',
  WV: 'West Virginia',
  WY: 'Wyoming',
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
  partnershipAsTaxMattersPartner: 'Partnership (as the Tax Matters Partner)',
  partnershipBBA:
    'Partnership (as a partnership representative under the BBA regime)',
  partnershipOtherThanTaxMatters:
    'Partnership (as a partner other than Tax Matters Partner)',
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
  postalCode: JoiValidationConstants.US_POSTAL_CODE.required(),
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
  isPaper = false,
}) => {
  const baseValidationObject =
    countryType === ContactFactory.COUNTRY_TYPES.DOMESTIC
      ? domesticValidationObject
      : internationalValidationObject;

  if (isPaper) {
    baseValidationObject.phone = joi.string().optional();
  }
  return baseValidationObject;
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
 * @param {string} options.partyType see the PARTY_TYPES map for a list of all valid partyTypes
 * @param {string} options.countryType typically either 'domestic' or 'international'
 * @param {string} options.contactType typically either 'primary' or 'secondary'
 * @param {boolean} options.isPaper is paper case
 * @returns {object} the contact constructors for the primary and/or secondary contacts
 */
const getContactConstructor = ({
  contactType,
  countryType,
  isPaper,
  partyType,
}) => {
  const {
    getNextFriendForIncompetentPersonContact,
  } = require('./NextFriendForIncompetentPersonContact');
  const {
    getNextFriendForMinorContact,
  } = require('./NextFriendForMinorContact');
  const {
    getPartnershipAsTaxMattersPartnerPrimaryContact,
  } = require('./PartnershipAsTaxMattersPartnerContact');
  const {
    getPartnershipBBAPrimaryContact,
  } = require('./PartnershipBBAContact');
  const {
    getPartnershipOtherThanTaxMattersPrimaryContact,
  } = require('./PartnershipOtherThanTaxMattersContact');
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
    getPetitionerEstateWithExecutorPrimaryContact,
  } = require('./PetitionerEstateWithExecutorPrimaryContact');
  const {
    getPetitionerGuardianContact,
  } = require('./PetitionerGuardianContact');
  const {
    getPetitionerIntermediaryContact,
  } = require('./PetitionerIntermediaryContact');
  const { getPetitionerPrimaryContact } = require('./PetitionerPrimaryContact');
  const { getPetitionerSpouseContact } = require('./PetitionerSpouseContact');
  const { getPetitionerTrustContact } = require('./PetitionerTrustContact');
  const { getSurvivingSpouseContact } = require('./SurvivingSpouseContact');
  return {
    [ContactFactory.PARTY_TYPES.petitioner]: {
      primary: getPetitionerPrimaryContact({ countryType, isPaper }),
      secondary: null,
    }[contactType],
    [ContactFactory.PARTY_TYPES.transferee]: {
      primary: getPetitionerPrimaryContact({ countryType, isPaper }),
      secondary: null,
    }[contactType],
    [ContactFactory.PARTY_TYPES.donor]: {
      primary: getPetitionerPrimaryContact({ countryType, isPaper }),
      secondary: null,
    }[contactType],
    [ContactFactory.PARTY_TYPES.petitionerDeceasedSpouse]: {
      primary: getPetitionerPrimaryContact({ countryType, isPaper }),
      secondary: getPetitionerDeceasedSpouseContact({ countryType, isPaper }),
    }[contactType],
    [ContactFactory.PARTY_TYPES.survivingSpouse]: {
      primary: getSurvivingSpouseContact({ countryType, isPaper }),
      secondary: null,
    }[contactType],
    [ContactFactory.PARTY_TYPES.petitionerSpouse]: {
      primary: getPetitionerPrimaryContact({ countryType, isPaper }),
      secondary: getPetitionerSpouseContact({ countryType, isPaper }),
    }[contactType],
    [ContactFactory.PARTY_TYPES.corporation]: {
      primary: getPetitionerCorporationContact({ countryType, isPaper }),
      secondary: null,
    }[contactType],
    [ContactFactory.PARTY_TYPES.estateWithoutExecutor]: {
      primary: getPetitionerIntermediaryContact({ countryType, isPaper }),
      secondary: null,
    }[contactType],
    [ContactFactory.PARTY_TYPES.partnershipAsTaxMattersPartner]: {
      primary: getPartnershipAsTaxMattersPartnerPrimaryContact({
        countryType,
        isPaper,
      }),
      secondary: null,
    }[contactType],
    [ContactFactory.PARTY_TYPES.partnershipOtherThanTaxMatters]: {
      primary: getPartnershipOtherThanTaxMattersPrimaryContact({
        countryType,
        isPaper,
      }),
      secondary: null,
    }[contactType],
    [ContactFactory.PARTY_TYPES.nextFriendForMinor]: {
      primary: getNextFriendForMinorContact({ countryType, isPaper }),
      secondary: null,
    }[contactType],
    [ContactFactory.PARTY_TYPES.nextFriendForIncompetentPerson]: {
      primary: getNextFriendForIncompetentPersonContact({
        countryType,
        isPaper,
      }),
      secondary: null,
    }[contactType],
    [ContactFactory.PARTY_TYPES.estate]: {
      primary: getPetitionerEstateWithExecutorPrimaryContact({
        countryType,
        isPaper,
      }),
      secondary: null,
    }[contactType],
    [ContactFactory.PARTY_TYPES.partnershipBBA]: {
      primary: getPartnershipBBAPrimaryContact({ countryType, isPaper }),
      secondary: null,
    }[contactType],
    [ContactFactory.PARTY_TYPES.trust]: {
      primary: getPetitionerTrustContact({ countryType, isPaper }),
      secondary: null,
    }[contactType],
    [ContactFactory.PARTY_TYPES.conservator]: {
      primary: getPetitionerConservatorContact({ countryType, isPaper }),
      secondary: null,
    }[contactType],
    [ContactFactory.PARTY_TYPES.guardian]: {
      primary: getPetitionerGuardianContact({ countryType, isPaper }),
      secondary: null,
    }[contactType],
    [ContactFactory.PARTY_TYPES.custodian]: {
      primary: getPetitionerCustodianContact({ countryType, isPaper }),
      secondary: null,
    }[contactType],
  }[partyType];
};

/**
 * used for instantiating the primary and secondary contact objects which are later used in the Petition entity.
 *
 * @param {object} options the options object
 * @param {string} options.partyType see the PARTY_TYPES map for a list of all valid partyTypes
 * @param {string} options. object which should contain primary and secondary used for creating the contact entities
 * @returns {object} contains the primary and secondary contacts constructed
 */
ContactFactory.createContacts = ({ contactInfo, isPaper, partyType }) => {
  const primaryConstructor = getContactConstructor({
    contactType: 'primary',
    countryType: (contactInfo.primary || {}).countryType,
    isPaper,
    partyType,
  });
  const secondaryConstructor = getContactConstructor({
    contactType: 'secondary',
    countryType: (contactInfo.secondary || {}).countryType,
    isPaper,
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
  return ({ countryType, isPaper }) => {
    /**
     * creates a contact entity
     *
     * @param {object} rawContact the options object
     */
    function GenericContactConstructor(rawContact) {
      this.address1 = rawContact.address1;
      this.address2 = rawContact.address2 ? rawContact.address2 : undefined;
      this.address3 = rawContact.address3 ? rawContact.address3 : undefined;
      this.city = rawContact.city;
      this.country = rawContact.country;
      this.countryType = rawContact.countryType;
      this.email = rawContact.email;
      this.inCareOf = rawContact.inCareOf;
      this.name = rawContact.name;
      this.phone = rawContact.phone;
      this.postalCode = rawContact.postalCode;
      this.secondaryName = rawContact.secondaryName;
      this.state = rawContact.state;
      this.title = rawContact.title;
    }

    GenericContactConstructor.errorToMessageMap = {
      ...ContactFactory.getErrorToMessageMap({ countryType }),
      ...additionalErrorMappings,
    };

    joiValidationDecorator(
      GenericContactConstructor,
      joi.object().keys({
        ...ContactFactory.getValidationObject({ countryType, isPaper }),
        ...additionalValidation,
      }),
      undefined,
      GenericContactConstructor.errorToMessageMap,
    );

    return GenericContactConstructor;
  };
};

exports.ContactFactory = ContactFactory;
