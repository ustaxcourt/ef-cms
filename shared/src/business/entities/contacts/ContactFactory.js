const joi = require('joi');
const {
  CONTACT_TYPES,
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
      message: 'Enter ZIP code',
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

const commonValidationRequirements = {
  address1: JoiValidationConstants.STRING.max(100).required(),
  address2: JoiValidationConstants.STRING.max(100).optional(),
  address3: JoiValidationConstants.STRING.max(100).optional(),
  city: JoiValidationConstants.STRING.max(100).required(),
  contactId: JoiValidationConstants.UUID.required().description(
    'Unique contact ID only used by the system.',
  ),
  contactType: JoiValidationConstants.STRING.valid(
    ...Object.values(CONTACT_TYPES),
  ).required(),
  email: JoiValidationConstants.EMAIL.when('hasEAccess', {
    is: true,
    otherwise: joi.optional(),
    then: joi.required(),
  }),
  hasEAccess: joi
    .boolean()
    .optional()
    .description(
      'Flag that indicates if the contact has credentials to both the legacy and new system.',
    ),
  inCareOf: JoiValidationConstants.STRING.max(100).optional(),
  isAddressSealed: joi.boolean().required(),
  name: JoiValidationConstants.STRING.max(100).required(),
  phone: JoiValidationConstants.STRING.max(100).required(),
  sealedAndUnavailable: joi.boolean().optional(),
  secondaryName: JoiValidationConstants.STRING.max(100).optional(),
  serviceIndicator: JoiValidationConstants.STRING.valid(
    ...Object.values(SERVICE_INDICATOR_TYPES),
  ).optional(),
  title: JoiValidationConstants.STRING.max(100).optional(),
};

const domesticValidationObject = {
  countryType: JoiValidationConstants.STRING.valid(
    COUNTRY_TYPES.DOMESTIC,
  ).required(),
  ...commonValidationRequirements,
  postalCode: JoiValidationConstants.US_POSTAL_CODE.required(),
  state: JoiValidationConstants.STRING.valid(
    ...Object.keys(US_STATES),
    ...US_STATES_OTHER,
    STATE_NOT_AVAILABLE,
  ).required(),
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
}) => {
  return countryType === COUNTRY_TYPES.DOMESTIC
    ? cloneDeep(domesticValidationObject)
    : cloneDeep(internationalValidationObject);
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
 * @param {string} options.partyType see the PARTY_TYPES map for a list of all valid partyTypes
 * @returns {object} (<string>:<Function>) the contact constructors map for the primary contact, secondary contact
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
          primary: getPetitionerPrimaryContact,
          secondary: null,
        };
      case PARTY_TYPES.conservator:
        return {
          primary: getPetitionerConservatorContact,
          secondary: null,
        };
      case PARTY_TYPES.corporation:
        return {
          primary: getPetitionerCorporationContact,
          secondary: null,
        };
      case PARTY_TYPES.custodian:
        return {
          primary: getPetitionerCustodianContact,
          secondary: null,
        };
      case PARTY_TYPES.estate:
        return {
          primary: getPetitionerEstateWithExecutorPrimaryContact,
          secondary: null,
        };
      case PARTY_TYPES.estateWithoutExecutor:
        return {
          primary: getPetitionerIntermediaryContact,
          secondary: null,
        };
      case PARTY_TYPES.guardian:
        return {
          primary: getPetitionerGuardianContact,
          secondary: null,
        };
      case PARTY_TYPES.nextFriendForIncompetentPerson:
        return {
          primary: getNextFriendForIncompetentPersonContact,
          secondary: null,
        };
      case PARTY_TYPES.nextFriendForMinor:
        return {
          primary: getNextFriendForMinorContact,
          secondary: null,
        };
      case PARTY_TYPES.partnershipAsTaxMattersPartner:
        return {
          primary: getPartnershipAsTaxMattersPartnerPrimaryContact,
          secondary: null,
        };
      case PARTY_TYPES.partnershipBBA:
        return {
          primary: getPartnershipBBAPrimaryContact,
          secondary: null,
        };
      case PARTY_TYPES.partnershipOtherThanTaxMatters:
        return {
          primary: getPartnershipOtherThanTaxMattersPrimaryContact,
          secondary: null,
        };
      case PARTY_TYPES.petitionerDeceasedSpouse:
        return {
          primary: getPetitionerPrimaryContact,
          secondary: getPetitionerDeceasedSpouseContact,
        };
      case PARTY_TYPES.petitionerSpouse:
        return {
          primary: getPetitionerPrimaryContact,
          secondary: getPetitionerSpouseContact,
        };
      case PARTY_TYPES.survivingSpouse:
        return {
          primary: getSurvivingSpouseContact,
          secondary: null,
        };
      case PARTY_TYPES.trust:
        return {
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
 * used for instantiating the primary and secondary contact objects which are later used in the Case entity.
 *
 * @param {object} options the options object
 * @param {object} options.contactInfo information on party contacts (primary, secondary)
 * @param {string} options.partyType see the PARTY_TYPES map for a list of all valid partyTypes
 * @returns {object} contains the primary and secondary contact instances
 */
ContactFactory.createContacts = ({
  applicationContext,
  contactInfo,
  partyType,
}) => {
  const constructorMap = ContactFactory.getContactConstructors({
    partyType,
  });

  const constructors = {
    primary:
      constructorMap.primary &&
      constructorMap.primary({
        countryType: (contactInfo.primary || {}).countryType,
      }),
    secondary:
      constructorMap.secondary &&
      constructorMap.secondary({
        countryType: (contactInfo.secondary || {}).countryType,
      }),
  };

  return {
    primary: constructors.primary
      ? new constructors.primary(
          { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
          {
            applicationContext,
          },
        )
      : {},
    secondary: constructors.secondary
      ? new constructors.secondary(
          { ...contactInfo.secondary, contactType: CONTACT_TYPES.secondary },
          {
            applicationContext,
          },
        )
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
  const ContactFactoryConstructor = ({ countryType }) => {
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
      this.contactType = rawContact.contactType;
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
      this.hasEAccess = rawContact.hasEAccess || undefined;
    };

    GenericContactConstructor.contactName = () => contactName;

    GenericContactConstructor.errorToMessageMap = {
      ...ContactFactory.getErrorToMessageMap({ countryType }),
      ...additionalErrorMappings,
    };

    GenericContactConstructor.VALIDATION_RULES = joi.object().keys({
      ...ContactFactory.getValidationObject({ countryType }),
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
