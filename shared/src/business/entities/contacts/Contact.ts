import {
  CountryTypes,
  STATE_NOT_AVAILABLE,
  US_STATES,
  US_STATES_OTHER,
} from '../EntityConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { formatPhoneNumber } from '../../utilities/formatPhoneNumber';

export class Contact extends JoiValidationEntity {
  contactId: any;
  address1: any;
  address2: any;
  address3: any;
  city: any;
  contactType: any;
  country: any;
  countryType: CountryTypes;
  email: any;
  inCareOf: any;
  isAddressSealed: any;
  sealedAndUnavailable: any;
  paperPetitionEmail: any;
  hasConsentedToEService: any;
  name: any;
  phone: any;
  postalCode: any;
  secondaryName: any;
  serviceIndicator: any;
  state: any;
  title: any;
  additionalName: any;
  hasEAccess: any;

  constructor(
    rawContact,
    contactName: string,
    { applicationContext }: { applicationContext: IApplicationContext },
  ) {
    super(contactName);
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
    this.paperPetitionEmail = rawContact.paperPetitionEmail;
    this.hasConsentedToEService = rawContact.hasConsentedToEService;
    this.name = rawContact.name;
    this.phone = formatPhoneNumber(rawContact.phone);
    this.postalCode = rawContact.postalCode;
    this.secondaryName = rawContact.secondaryName;
    this.serviceIndicator = rawContact.serviceIndicator;
    this.state = rawContact.state;
    this.title = rawContact.title;
    this.additionalName = rawContact.additionalName;
    this.hasEAccess = rawContact.hasEAccess || undefined;
  }

  static SHARED_VALIDATION_MESSAGES = {
    address1: 'Enter mailing address',
    city: 'Enter city',
    countryType: 'Enter country type',
    name: 'Enter name',
    paperPetitionEmail: 'Enter email address in format: yourname@example.com',
    phone: 'Enter phone number',
  };

  static DOMESTIC_VALIDATION_MESSAGES = {
    ...Contact.SHARED_VALIDATION_MESSAGES,
    postalCode: [
      {
        contains: 'match',
        message: 'Enter ZIP code',
      },
      'Enter ZIP code',
    ],
    state: 'Enter state',
  };

  static INTERNATIONAL_VALIDATION_MESSAGES = {
    ...Contact.SHARED_VALIDATION_MESSAGES,
    country: 'Enter a country',
    postalCode: 'Enter ZIP code',
  };

  static SHARED_VALIDATION_RULES = {
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

  static DOMESTIC_VALIDATION_RULES = {
    countryType: JoiValidationConstants.STRING.valid(
      COUNTRY_TYPES.DOMESTIC,
    ).required(),
    ...Contact.SHARED_VALIDATION_RULES,
    postalCode: JoiValidationConstants.US_POSTAL_CODE.required(),
    state: JoiValidationConstants.STRING.valid(
      ...Object.keys(US_STATES),
      ...Object.keys(US_STATES_OTHER),
      STATE_NOT_AVAILABLE,
    ).required(),
  };

  static INTERNATIONAL_VALIDATION_RULES = {
    country: JoiValidationConstants.STRING.max(500).required(),
    countryType: JoiValidationConstants.STRING.valid(
      COUNTRY_TYPES.INTERNATIONAL,
    ).required(),
    ...Contact.SHARED_VALIDATION_RULES,
    postalCode: JoiValidationConstants.STRING.max(100).required(),
  };

  getValidationRules() {
    return this.countryType === COUNTRY_TYPES.DOMESTIC
      ? Contact.DOMESTIC_VALIDATION_RULES
      : Contact.INTERNATIONAL_VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return this.countryType === COUNTRY_TYPES.DOMESTIC
      ? Contact.DOMESTIC_VALIDATION_MESSAGES
      : Contact.INTERNATIONAL_VALIDATION_MESSAGES;
  }
}
