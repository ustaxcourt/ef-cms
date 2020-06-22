const joi = require('@hapi/joi');
const {
  COUNTRY_TYPES,
  PARTY_TYPES,
  SERVICE_INDICATOR_TYPES,
  US_STATES,
  US_STATES_OTHER,
} = require('../EntityConstants');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

const ContactFactory = {};

ContactFactory.DOMESTIC_VALIDATION_ERROR_MESSAGES = {
  address1: 'Enter mailing address',
  city: 'Enter city',
  countryType: 'Enter country type',
  name: 'Enter name',
  phone: 'Enter phone number',
  postalCode: [
    {
      contains: 'match',
      message: 'Enter ZIP code.',
    },
    'Enter ZIP code',
  ],
  state: 'Enter state',
};

ContactFactory.INTERNATIONAL_VALIDATION_ERROR_MESSAGES = {
  address1: 'Enter mailing address',
  city: 'Enter city',
  country: 'Enter a country',
  countryType: 'Enter country type',
  name: 'Enter name',
  phone: 'Enter phone number',
  postalCode: 'Enter ZIP code',
};

/* eslint-disable sort-keys-fix/sort-keys-fix */

const commonValidationRequirements = {
  address1: joi.string().max(500).required(),
  address2: joi.string().max(500).optional(),
  address3: joi.string().max(500).optional(),
  city: joi.string().max(500).required(),
  email: joi.string().max(500).optional(),
  inCareOf: joi.string().max(500).optional(),
  name: joi.string().max(500).required(),
  phone: joi.string().max(500).required(),
  secondaryName: joi.string().max(500).optional(),
  title: joi.string().max(500).optional(),
  serviceIndicator: joi
    .string()
    .valid(...Object.values(SERVICE_INDICATOR_TYPES))
    .optional(),
};
const domesticValidationObject = {
  countryType: joi.string().valid(COUNTRY_TYPES.DOMESTIC).required(),
  ...commonValidationRequirements,
  state: joi
    .string()
    .valid(...Object.keys(US_STATES), ...US_STATES_OTHER)
    .required(),
  postalCode: JoiValidationConstants.US_POSTAL_CODE.required(),
};

const internationalValidationObject = {
  country: joi.string().max(500).required(),
  countryType: joi.string().valid(COUNTRY_TYPES.INTERNATIONAL).required(),
  ...commonValidationRequirements,
  postalCode: joi.string().max(100).required(),
};

/* eslint-enable sort-keys-fix/sort-keys-fix */

/**
 * used for getting the joi validation object used for the different country type contacts.
 *
 * @param {options} options the options object
 * @param {options} options.countryType the country type of the contact
 * @returns {object} the joi validation object
 */
ContactFactory.getValidationObject = ({
  countryType = COUNTRY_TYPES.DOMESTIC,
  isPaper = false,
}) => {
  const baseValidationObject =
    countryType === COUNTRY_TYPES.DOMESTIC
      ? domesticValidationObject
      : internationalValidationObject;

  if (isPaper) {
    baseValidationObject.phone = joi.string().max(100).optional();
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
  countryType = COUNTRY_TYPES.DOMESTIC,
}) => {
  return countryType === COUNTRY_TYPES.DOMESTIC
    ? ContactFactory.DOMESTIC_VALIDATION_ERROR_MESSAGES
    : ContactFactory.INTERNATIONAL_VALIDATION_ERROR_MESSAGES;
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
  const { getOtherPetitionerContact } = require('./OtherPetitionerContact');
  const { getPetitionerPrimaryContact } = require('./PetitionerPrimaryContact');
  const { getPetitionerSpouseContact } = require('./PetitionerSpouseContact');
  const { getPetitionerTrustContact } = require('./PetitionerTrustContact');
  const { getSurvivingSpouseContact } = require('./SurvivingSpouseContact');
  //TODO - refactor to reduce complexity
  return {
    [PARTY_TYPES.petitioner]: {
      otherPetitioners: getOtherPetitionerContact({ countryType, isPaper }),
      primary: getPetitionerPrimaryContact({ countryType, isPaper }),
      secondary: null,
    }[contactType],
    [PARTY_TYPES.transferee]: {
      otherPetitioners: getOtherPetitionerContact({ countryType, isPaper }),
      primary: getPetitionerPrimaryContact({ countryType, isPaper }),
      secondary: null,
    }[contactType],
    [PARTY_TYPES.donor]: {
      otherPetitioners: getOtherPetitionerContact({ countryType, isPaper }),
      primary: getPetitionerPrimaryContact({ countryType, isPaper }),
      secondary: null,
    }[contactType],
    [PARTY_TYPES.petitionerDeceasedSpouse]: {
      otherPetitioners: getOtherPetitionerContact({ countryType, isPaper }),
      primary: getPetitionerPrimaryContact({ countryType, isPaper }),
      secondary: getPetitionerDeceasedSpouseContact({ countryType, isPaper }),
    }[contactType],
    [PARTY_TYPES.survivingSpouse]: {
      otherPetitioners: getOtherPetitionerContact({ countryType, isPaper }),
      primary: getSurvivingSpouseContact({ countryType, isPaper }),
      secondary: null,
    }[contactType],
    [PARTY_TYPES.petitionerSpouse]: {
      otherPetitioners: getOtherPetitionerContact({ countryType, isPaper }),
      primary: getPetitionerPrimaryContact({ countryType, isPaper }),
      secondary: getPetitionerSpouseContact({ countryType, isPaper }),
    }[contactType],
    [PARTY_TYPES.corporation]: {
      otherPetitioners: getOtherPetitionerContact({ countryType, isPaper }),
      primary: getPetitionerCorporationContact({ countryType, isPaper }),
      secondary: null,
    }[contactType],
    [PARTY_TYPES.estateWithoutExecutor]: {
      otherPetitioners: getOtherPetitionerContact({ countryType, isPaper }),
      primary: getPetitionerIntermediaryContact({ countryType, isPaper }),
      secondary: null,
    }[contactType],
    [PARTY_TYPES.partnershipAsTaxMattersPartner]: {
      otherPetitioners: getOtherPetitionerContact({ countryType, isPaper }),
      primary: getPartnershipAsTaxMattersPartnerPrimaryContact({
        countryType,
        isPaper,
      }),
      secondary: null,
    }[contactType],
    [PARTY_TYPES.partnershipOtherThanTaxMatters]: {
      otherPetitioners: getOtherPetitionerContact({ countryType, isPaper }),
      primary: getPartnershipOtherThanTaxMattersPrimaryContact({
        countryType,
        isPaper,
      }),
      secondary: null,
    }[contactType],
    [PARTY_TYPES.nextFriendForMinor]: {
      otherPetitioners: getOtherPetitionerContact({ countryType, isPaper }),
      primary: getNextFriendForMinorContact({ countryType, isPaper }),
      secondary: null,
    }[contactType],
    [PARTY_TYPES.nextFriendForIncompetentPerson]: {
      otherPetitioners: getOtherPetitionerContact({ countryType, isPaper }),
      primary: getNextFriendForIncompetentPersonContact({
        countryType,
        isPaper,
      }),
      secondary: null,
    }[contactType],
    [PARTY_TYPES.estate]: {
      otherPetitioners: getOtherPetitionerContact({ countryType, isPaper }),
      primary: getPetitionerEstateWithExecutorPrimaryContact({
        countryType,
        isPaper,
      }),
      secondary: null,
    }[contactType],
    [PARTY_TYPES.partnershipBBA]: {
      otherPetitioners: getOtherPetitionerContact({ countryType, isPaper }),
      primary: getPartnershipBBAPrimaryContact({ countryType, isPaper }),
      secondary: null,
    }[contactType],
    [PARTY_TYPES.trust]: {
      otherPetitioners: getOtherPetitionerContact({ countryType, isPaper }),
      primary: getPetitionerTrustContact({ countryType, isPaper }),
      secondary: null,
    }[contactType],
    [PARTY_TYPES.conservator]: {
      otherPetitioners: getOtherPetitionerContact({ countryType, isPaper }),
      primary: getPetitionerConservatorContact({ countryType, isPaper }),
      secondary: null,
    }[contactType],
    [PARTY_TYPES.guardian]: {
      otherPetitioners: getOtherPetitionerContact({ countryType, isPaper }),
      primary: getPetitionerGuardianContact({ countryType, isPaper }),
      secondary: null,
    }[contactType],
    [PARTY_TYPES.custodian]: {
      otherPetitioners: getOtherPetitionerContact({ countryType, isPaper }),
      primary: getPetitionerCustodianContact({ countryType, isPaper }),
      secondary: null,
    }[contactType],
  }[partyType];
};

/**
 * used for instantiating the primary and secondary contact objects which are later used in the Case entity.
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
  let otherPetitioners = [];
  if (Array.isArray(contactInfo.otherPetitioners)) {
    otherPetitioners = otherPetitionersCreation(
      contactInfo.otherPetitioners,
      partyType,
    );
  }

  return {
    otherPetitioners,
    primary: primaryConstructor
      ? new primaryConstructor(contactInfo.primary || {})
      : {},
    secondary: secondaryConstructor
      ? new secondaryConstructor(contactInfo.secondary || {})
      : {},
  };
};

const otherPetitionersCreation = (otherPetitioners, partyType) => {
  const otherPetitionerConstructor = getContactConstructor({
    contactType: 'otherPetitioners',
    partyType,
  });
  return otherPetitioners.map(otherPetitioner => {
    return new otherPetitionerConstructor(otherPetitioner);
  });
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
      //TODO make this look like additionalName
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
      this.serviceIndicator = rawContact.serviceIndicator;
      this.state = rawContact.state;
      this.title = rawContact.title;
      this.additionalName = rawContact.additionalName;
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
      GenericContactConstructor.errorToMessageMap,
    );

    return GenericContactConstructor;
  };
};

exports.ContactFactory = ContactFactory;
