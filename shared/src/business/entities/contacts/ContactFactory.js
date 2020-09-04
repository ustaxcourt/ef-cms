const joi = require('joi');
const {
  COUNTRY_TYPES,
  PARTY_TYPES,
  SERVICE_INDICATOR_TYPES,
  STATE_NOT_AVAILABLE,
  US_STATES,
  US_STATES_OTHER,
} = require('../EntityConstants');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { cloneDeep } = require('lodash');

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

ContactFactory.getValidationRules = contactType => {
  let results = joi;

  for (const partyType in PARTY_TYPES) {
    const constructor = ContactFactory.getContactConstructors({
      partyType: PARTY_TYPES[partyType],
    })[contactType];

    if (constructor) {
      results = results.when('partyType', {
        is: PARTY_TYPES[partyType],
        then: joi
          .alternatives(
            constructor({
              countryType: COUNTRY_TYPES.DOMESTIC,
              isPaper: true,
            }).VALIDATION_RULES,
            constructor({
              countryType: COUNTRY_TYPES.INTERNATIONAL,
              isPaper: true,
            }).VALIDATION_RULES,
            constructor({
              countryType: COUNTRY_TYPES.DOMESTIC,
              isPaper: false,
            }).VALIDATION_RULES,
            constructor({
              countryType: COUNTRY_TYPES.INTERNATIONAL,
              isPaper: false,
            }).VALIDATION_RULES,
          )
          .required(),
      });
    } else {
      results = results.forbidden();
    }
  }

  return results;
};

/* eslint-disable sort-keys-fix/sort-keys-fix */

const commonValidationRequirements = {
  address1: JoiValidationConstants.STRING.max(100).required(),
  address2: JoiValidationConstants.STRING.max(100).optional(),
  address3: JoiValidationConstants.STRING.max(100).optional(),
  city: JoiValidationConstants.STRING.max(100).required(),
  contactId: JoiValidationConstants.UUID.required().description(
    'Unique contact ID only used by the system.',
  ),
  email: JoiValidationConstants.EMAIL.when('hasEAccess', {
    is: true,
    then: joi.required(),
    otherwise: joi.optional(),
  }),
  inCareOf: JoiValidationConstants.STRING.max(100).optional(),
  isAddressSealed: joi.boolean().required(),
  sealedAndUnavailable: joi.boolean().optional(),
  name: JoiValidationConstants.STRING.max(100).required(),
  phone: JoiValidationConstants.STRING.max(100).required(),
  secondaryName: JoiValidationConstants.STRING.max(100).optional(),
  title: JoiValidationConstants.STRING.max(100).optional(),
  serviceIndicator: JoiValidationConstants.STRING.valid(
    ...Object.values(SERVICE_INDICATOR_TYPES),
  ).optional(),
  hasEAccess: joi
    .boolean()
    .optional()
    .description(
      'Flag that indicates if the contact has "eAccess" login credentials to the legacy system.',
    ),
};

const domesticValidationObject = {
  countryType: JoiValidationConstants.STRING.valid(
    COUNTRY_TYPES.DOMESTIC,
  ).required(),
  ...commonValidationRequirements,
  state: JoiValidationConstants.STRING.valid(
    ...Object.keys(US_STATES),
    ...US_STATES_OTHER,
    STATE_NOT_AVAILABLE,
  ).required(),
  postalCode: JoiValidationConstants.US_POSTAL_CODE.required(),
};

ContactFactory.domesticValidationObject = domesticValidationObject;

const internationalValidationObject = {
  country: JoiValidationConstants.STRING.max(500).required(),
  countryType: JoiValidationConstants.STRING.valid(
    COUNTRY_TYPES.INTERNATIONAL,
  ).required(),
  ...commonValidationRequirements,
  postalCode: JoiValidationConstants.STRING.max(100).required(),
};

ContactFactory.internationalValidationObject = internationalValidationObject;

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
      ? cloneDeep(domesticValidationObject)
      : cloneDeep(internationalValidationObject);

  if (isPaper) {
    baseValidationObject.phone = JoiValidationConstants.STRING.max(
      100,
    ).optional();
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
 * used for getting the contact constructors depending on the party type and contact type
 *
 * @param {object} options the options object
 * @param {string} options.countryType typically either 'domestic' or 'international'
 * @param {boolean} options.isPaper is paper case
 * @param {string} options.partyType see the PARTY_TYPES map for a list of all valid partyTypes
 * @returns {object} (<string>:<Function>) the contact constructors map for the primary contact, secondary contact, other petitioner contacts
 */
ContactFactory.getContactConstructors = ({ partyType }) => {
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
  const { getOtherFilerContact } = require('./OtherFilerContact');
  const { getOtherPetitionerContact } = require('./OtherPetitionerContact');
  const { getPetitionerPrimaryContact } = require('./PetitionerPrimaryContact');
  const { getPetitionerSpouseContact } = require('./PetitionerSpouseContact');
  const { getPetitionerTrustContact } = require('./PetitionerTrustContact');
  const { getSurvivingSpouseContact } = require('./SurvivingSpouseContact');

  const partyConstructorFetch = partyTypeValue => {
    switch (partyTypeValue) {
      case PARTY_TYPES.donor: // fall through
      case PARTY_TYPES.transferee: // fall through
      case PARTY_TYPES.petitioner:
        return {
          otherFilers: getOtherFilerContact,
          otherPetitioners: getOtherPetitionerContact,
          primary: getPetitionerPrimaryContact,
          secondary: null,
        };
      case PARTY_TYPES.conservator:
        return {
          otherFilers: getOtherFilerContact,
          otherPetitioners: getOtherPetitionerContact,
          primary: getPetitionerConservatorContact,
          secondary: null,
        };
      case PARTY_TYPES.corporation:
        return {
          otherFilers: getOtherFilerContact,
          otherPetitioners: getOtherPetitionerContact,
          primary: getPetitionerCorporationContact,
          secondary: null,
        };
      case PARTY_TYPES.custodian:
        return {
          otherFilers: getOtherFilerContact,
          otherPetitioners: getOtherPetitionerContact,
          primary: getPetitionerCustodianContact,
          secondary: null,
        };
      case PARTY_TYPES.estate:
        return {
          otherFilers: getOtherFilerContact,
          otherPetitioners: getOtherPetitionerContact,
          primary: getPetitionerEstateWithExecutorPrimaryContact,
          secondary: null,
        };
      case PARTY_TYPES.estateWithoutExecutor:
        return {
          otherFilers: getOtherFilerContact,
          otherPetitioners: getOtherPetitionerContact,
          primary: getPetitionerIntermediaryContact,
          secondary: null,
        };
      case PARTY_TYPES.guardian:
        return {
          otherFilers: getOtherFilerContact,
          otherPetitioners: getOtherPetitionerContact,
          primary: getPetitionerGuardianContact,
          secondary: null,
        };
      case PARTY_TYPES.nextFriendForIncompetentPerson:
        return {
          otherFilers: getOtherFilerContact,
          otherPetitioners: getOtherPetitionerContact,
          primary: getNextFriendForIncompetentPersonContact,
          secondary: null,
        };
      case PARTY_TYPES.nextFriendForMinor:
        return {
          otherFilers: getOtherFilerContact,
          otherPetitioners: getOtherPetitionerContact,
          primary: getNextFriendForMinorContact,
          secondary: null,
        };

      case PARTY_TYPES.partnershipAsTaxMattersPartner:
        return {
          otherFilers: getOtherFilerContact,
          otherPetitioners: getOtherPetitionerContact,
          primary: getPartnershipAsTaxMattersPartnerPrimaryContact,
          secondary: null,
        };
      case PARTY_TYPES.partnershipBBA:
        return {
          otherFilers: getOtherFilerContact,
          otherPetitioners: getOtherPetitionerContact,
          primary: getPartnershipBBAPrimaryContact,
          secondary: null,
        };
      case PARTY_TYPES.partnershipOtherThanTaxMatters:
        return {
          otherFilers: getOtherFilerContact,
          otherPetitioners: getOtherPetitionerContact,
          primary: getPartnershipOtherThanTaxMattersPrimaryContact,
          secondary: null,
        };
      case PARTY_TYPES.petitionerDeceasedSpouse:
        return {
          otherFilers: getOtherFilerContact,
          otherPetitioners: getOtherPetitionerContact,
          primary: getPetitionerPrimaryContact,
          secondary: getPetitionerDeceasedSpouseContact,
        };
      case PARTY_TYPES.petitionerSpouse:
        return {
          otherFilers: getOtherFilerContact,
          otherPetitioners: getOtherPetitionerContact,
          primary: getPetitionerPrimaryContact,
          secondary: getPetitionerSpouseContact,
        };
      case PARTY_TYPES.survivingSpouse:
        return {
          otherFilers: getOtherFilerContact,
          otherPetitioners: getOtherPetitionerContact,
          primary: getSurvivingSpouseContact,
          secondary: null,
        };
      case PARTY_TYPES.trust:
        return {
          otherFilers: getOtherFilerContact,
          otherPetitioners: getOtherPetitionerContact,
          primary: getPetitionerTrustContact,
          secondary: null,
        };
      default:
        if (partyTypeValue) {
          throw new Error(`Unrecognized party type "${partyTypeValue}"`);
        }
        return {};
    }
  };

  return partyConstructorFetch(partyType);
};

/**
 * used for instantiating the primary, secondary, other contact objects which are later used in the Case entity.
 *
 * @param {object} options the options object
 * @param {object} options.contactInfo information on party contacts (primary, secondary, other)
 * @param {boolean} options.isPaper whether service is paper
 * @param {string} options.partyType see the PARTY_TYPES map for a list of all valid partyTypes
 * @returns {object} contains the primary, secondary, and other contact instances
 */
ContactFactory.createContacts = ({
  applicationContext,
  contactInfo,
  isPaper,
  partyType,
}) => {
  const constructorMap = ContactFactory.getContactConstructors({ partyType });

  const constructors = {
    primary:
      constructorMap.primary &&
      constructorMap.primary({
        countryType: (contactInfo.primary || {}).countryType,
        isPaper,
      }),
    secondary:
      constructorMap.secondary &&
      constructorMap.secondary({
        countryType: (contactInfo.secondary || {}).countryType,
        isPaper,
      }),
  };

  let otherPetitioners = [];
  if (Array.isArray(contactInfo.otherPetitioners)) {
    otherPetitioners = contactInfo.otherPetitioners.map(otherPetitioner => {
      const otherPetitionerConstructor = constructorMap.otherPetitioners
        ? constructorMap.otherPetitioners({
            countryType: otherPetitioner.countryType,
            isPaper,
          })
        : undefined;
      return otherPetitionerConstructor
        ? new otherPetitionerConstructor(otherPetitioner, {
            applicationContext,
          })
        : {};
    });
  }

  let otherFilers = [];
  if (Array.isArray(contactInfo.otherFilers)) {
    otherFilers = contactInfo.otherFilers.map(otherFiler => {
      const otherFilerConstructor = constructorMap.otherFilers
        ? constructorMap.otherFilers({
            countryType: otherFiler.countryType,
            isPaper,
          })
        : undefined;
      return otherFilerConstructor
        ? new otherFilerConstructor(otherFiler, { applicationContext })
        : {};
    });
  }

  return {
    otherFilers,
    otherPetitioners,
    primary: constructors.primary
      ? new constructors.primary(contactInfo.primary || {}, {
          applicationContext,
        })
      : {},
    secondary: constructors.secondary
      ? new constructors.secondary(contactInfo.secondary || {}, {
          applicationContext,
        })
      : undefined,
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
  contactName,
}) => {
  const ContactFactoryConstructor = ({ countryType, isPaper }) => {
    /**
     * creates a contact entity
     *
     * @param {object} rawContact the options object
     */
    function GenericContactConstructor() {}
    GenericContactConstructor.prototype.init = function init(
      rawContact,
      { applicationContext },
    ) {
      if (!applicationContext) {
        throw new TypeError('applicationContext must be defined');
      }
      this.contactId = rawContact.contactId || applicationContext.getUniqueId();
      this.address1 = rawContact.address1;
      this.address2 = rawContact.address2 || undefined;
      this.address3 = rawContact.address3 || undefined;
      this.city = rawContact.city;
      this.country = rawContact.country;
      this.countryType = rawContact.countryType;
      this.email = rawContact.email;
      this.inCareOf = rawContact.inCareOf;
      this.isAddressSealed = rawContact.isAddressSealed || false;
      this.sealedAndUnavailable = rawContact.sealedAndUnavailable || false;
      this.name = rawContact.name;
      this.phone = rawContact.phone;
      this.postalCode = rawContact.postalCode;
      this.secondaryName = rawContact.secondaryName;
      this.serviceIndicator = rawContact.serviceIndicator;
      this.state = rawContact.state;
      this.title = rawContact.title;
      this.additionalName = rawContact.additionalName;
      this.otherFilerType = rawContact.otherFilerType;
      this.hasEAccess = rawContact.hasEAccess || undefined;
    };

    GenericContactConstructor.contactName = () => contactName;

    GenericContactConstructor.errorToMessageMap = {
      ...ContactFactory.getErrorToMessageMap({ countryType }),
      ...additionalErrorMappings,
    };

    GenericContactConstructor.VALIDATION_RULES = joi.object().keys({
      ...ContactFactory.getValidationObject({ countryType, isPaper }),
      ...additionalValidation,
    });

    joiValidationDecorator(
      GenericContactConstructor,
      GenericContactConstructor.VALIDATION_RULES,
      GenericContactConstructor.errorToMessageMap,
    );

    return validEntityDecorator(GenericContactConstructor);
  };

  ContactFactoryConstructor.contactName = contactName;

  return ContactFactoryConstructor;
};

exports.ContactFactory = ContactFactory;
