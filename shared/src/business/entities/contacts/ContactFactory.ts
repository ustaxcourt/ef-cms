import {
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  SERVICE_INDICATOR_TYPES,
  STATE_NOT_AVAILABLE,
  US_STATES,
  US_STATES_OTHER,
} from '../EntityConstants';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { NextFriendForIncompetentPersonContact } from './NextFriendForIncompetentPersonContact';
import { NextFriendForMinorContact } from './NextFriendForMinorContact';
import { PartnershipAsTaxMattersPartnerPrimaryContact } from './PartnershipAsTaxMattersPartnerContact';
import { PartnershipBBAPrimaryContact } from './PartnershipBBAContact';
import { PartnershipOtherThanTaxMattersPrimaryContact } from './PartnershipOtherThanTaxMattersContact';
import { PetitionerConservatorContact } from './PetitionerConservatorContact';
import { PetitionerCorporationContact } from './PetitionerCorporationContact';
import { PetitionerCustodianContact } from './PetitionerCustodianContact';
import { PetitionerDeceasedSpouseContact } from './PetitionerDeceasedSpouseContact';
import { PetitionerEstateWithExecutorPrimaryContact } from './PetitionerEstateWithExecutorPrimaryContact';
import { PetitionerGuardianContact } from './PetitionerGuardianContact';
import { PetitionerIntermediaryContact } from './PetitionerIntermediaryContact';
import { PetitionerPrimaryContact } from './PetitionerPrimaryContact';
import { PetitionerSpouseContact } from './PetitionerSpouseContact';
import { PetitionerTrustContact } from './PetitionerTrustContact';
import { SurvivingSpouseContact } from './SurvivingSpouseContact';
import { cloneDeep } from 'lodash';
import joi from 'joi';

const ContactFactory = {} as any;

ContactFactory.SHARED_ERROR_MESSAGES = {
  address1: 'Enter mailing address',
  city: 'Enter city',
  countryType: 'Enter country type',
  name: 'Enter name',
  paperPetitionEmail: 'Enter email address in format: yourname@example.com',
  phone: 'Enter phone number',
};

ContactFactory.DOMESTIC_VALIDATION_ERROR_MESSAGES = {
  ...ContactFactory.SHARED_ERROR_MESSAGES,
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
  ...ContactFactory.SHARED_ERROR_MESSAGES,
  country: 'Enter a country',
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
  hasConsentedToEService: joi
    .boolean()
    .optional()
    .description(
      'Flag that indicates if the petitioner checked the "I consent to electronic service" box on their petition form',
    ),
  hasEAccess: joi
    .boolean()
    .optional()
    .description(
      'Flag that indicates if the contact has credentials to both the legacy and new system.',
    ),
  inCareOf: JoiValidationConstants.STRING.max(100).optional(),
  isAddressSealed: joi.boolean().required(),
  name: JoiValidationConstants.STRING.max(100).required(),
  paperPetitionEmail: JoiValidationConstants.EMAIL.optional()
    .allow(null)
    .description('Email provided by the petitioner on their petition form'),
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
    ...Object.keys(US_STATES_OTHER),
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

ContactFactory.getContactConstructors = ({ partyType }) => {
  switch (partyType) {
    case PARTY_TYPES.donor:
    case PARTY_TYPES.transferee:
    case PARTY_TYPES.petitioner:
      return {
        primary: PetitionerPrimaryContact,
        secondary: null,
      };
    case PARTY_TYPES.conservator:
      return {
        primary: PetitionerConservatorContact,
        secondary: null,
      };
    case PARTY_TYPES.corporation:
      return {
        primary: PetitionerCorporationContact,
        secondary: null,
      };
    case PARTY_TYPES.custodian:
      return {
        primary: PetitionerCustodianContact,
        secondary: null,
      };
    case PARTY_TYPES.estate:
      return {
        primary: PetitionerEstateWithExecutorPrimaryContact,
        secondary: null,
      };
    case PARTY_TYPES.estateWithoutExecutor:
      return {
        primary: PetitionerIntermediaryContact,
        secondary: null,
      };
    case PARTY_TYPES.guardian:
      return {
        primary: PetitionerGuardianContact,
        secondary: null,
      };
    case PARTY_TYPES.nextFriendForIncompetentPerson:
      return {
        primary: NextFriendForIncompetentPersonContact,
        secondary: null,
      };
    case PARTY_TYPES.nextFriendForMinor:
      return {
        primary: NextFriendForMinorContact,
        secondary: null,
      };
    case PARTY_TYPES.partnershipAsTaxMattersPartner:
      return {
        primary: PartnershipAsTaxMattersPartnerPrimaryContact,
        secondary: null,
      };
    case PARTY_TYPES.partnershipBBA:
      return {
        primary: PartnershipBBAPrimaryContact,
        secondary: null,
      };
    case PARTY_TYPES.partnershipOtherThanTaxMatters:
      return {
        primary: PartnershipOtherThanTaxMattersPrimaryContact,
        secondary: null,
      };
    case PARTY_TYPES.petitionerDeceasedSpouse:
      return {
        primary: PetitionerPrimaryContact,
        secondary: PetitionerDeceasedSpouseContact,
      };
    case PARTY_TYPES.petitionerSpouse:
      return {
        primary: PetitionerPrimaryContact,
        secondary: PetitionerSpouseContact,
      };
    case PARTY_TYPES.survivingSpouse:
      return {
        primary: SurvivingSpouseContact,
        secondary: null,
      };
    case PARTY_TYPES.trust:
      return {
        primary: PetitionerTrustContact,
        secondary: null,
      };
    default:
      if (partyType) {
        throw new Error(`Unrecognized party type "${partyType}"`);
      }
      return {};
  }
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

  return {
    primary: constructorMap.primary
      ? new constructorMap.primary(
          { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
          {
            applicationContext,
          },
        )
      : {},
    secondary: constructorMap.secondary
      ? new constructorMap.secondary(
          { ...contactInfo.secondary, contactType: CONTACT_TYPES.secondary },
          {
            applicationContext,
          },
        )
      : undefined,
  };
};

exports.ContactFactory = ContactFactory;
