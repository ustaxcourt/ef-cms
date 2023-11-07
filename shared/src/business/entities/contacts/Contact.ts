import {
  CONTACT_TYPES,
  COUNTRY_TYPES,
  CountryTypes,
  SERVICE_INDICATOR_TYPES,
  STATE_NOT_AVAILABLE,
  US_STATES,
  US_STATES_OTHER,
} from '../EntityConstants';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { formatPhoneNumber } from '../../utilities/formatPhoneNumber';
import joi from 'joi';

export class Contact extends JoiValidationEntity {
  public contactId: string;
  public address1: string;
  public address2?: string;
  public address3?: string;
  public city: string;
  public contactType: string;
  public country?: string;
  public countryType: CountryTypes;
  public email?: string;
  public inCareOf?: string;
  public isAddressSealed: boolean;
  public sealedAndUnavailable?: boolean;
  public paperPetitionEmail?: string;
  public hasConsentedToEService?: boolean;
  public name: string;
  public phone: string;
  public postalCode: string;
  public secondaryName?: string;
  public serviceIndicator?: string;
  public state?: string;
  public title?: string;
  public additionalName?: string;
  public hasEAccess?: boolean;

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

  static SHARED_VALIDATION_RULES = {
    address1: JoiValidationConstants.STRING.max(100)
      .required()
      .messages({ '*': 'Enter mailing address' }),
    address2: JoiValidationConstants.STRING.max(100).optional(),
    address3: JoiValidationConstants.STRING.max(100).optional(),
    city: JoiValidationConstants.STRING.max(100)
      .required()
      .messages({ '*': 'Enter city' }),
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
    name: JoiValidationConstants.STRING.max(100)
      .required()
      .messages({ '*': 'Enter name' }),
    paperPetitionEmail: JoiValidationConstants.EMAIL.optional()
      .allow(null)
      .description('Email provided by the petitioner on their petition form')
      .messages({ '*': 'Enter email address in format: yourname@example.com' }),
    phone: JoiValidationConstants.STRING.max(100)
      .required()
      .messages({ '*': 'Enter phone number' }),
    sealedAndUnavailable: joi.boolean().optional(),
    secondaryName: JoiValidationConstants.STRING.max(100).optional(),
    serviceIndicator: JoiValidationConstants.STRING.valid(
      ...Object.values(SERVICE_INDICATOR_TYPES),
    ).optional(),
    title: JoiValidationConstants.STRING.max(100).optional(),
  } as const;

  static DOMESTIC_VALIDATION_RULES = {
    countryType: JoiValidationConstants.STRING.valid(COUNTRY_TYPES.DOMESTIC)
      .required()
      .messages({ '*': 'Enter country type' }),
    ...Contact.SHARED_VALIDATION_RULES,
    postalCode: JoiValidationConstants.US_POSTAL_CODE.required().messages({
      '*': 'Enter ZIP code',
    }),
    state: JoiValidationConstants.STRING.valid(
      ...Object.keys(US_STATES),
      ...Object.keys(US_STATES_OTHER),
      STATE_NOT_AVAILABLE,
    )
      .required()
      .messages({ '*': 'Enter state' }),
  } as const;

  static INTERNATIONAL_VALIDATION_RULES = {
    country: JoiValidationConstants.STRING.max(500)
      .required()
      .messages({ '*': 'Enter a country' }),
    countryType: JoiValidationConstants.STRING.valid(
      COUNTRY_TYPES.INTERNATIONAL,
    )
      .required()
      .messages({ '*': 'Enter country type' }),
    ...Contact.SHARED_VALIDATION_RULES,
    postalCode: JoiValidationConstants.STRING.max(100)
      .required()
      .messages({ '*': 'Enter ZIP code' }),
  } as const;

  getValidationRules() {
    return this.countryType === COUNTRY_TYPES.INTERNATIONAL
      ? Contact.INTERNATIONAL_VALIDATION_RULES
      : Contact.DOMESTIC_VALIDATION_RULES;
  }
}

export type RawContact = ExcludeMethods<Contact>;
