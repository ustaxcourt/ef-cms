import {
  COUNTRY_TYPES,
  CountryTypes,
  STATE_NOT_AVAILABLE,
  US_STATES,
  US_STATES_OTHER,
} from '../EntityConstants';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { formatPhoneNumber } from '../../utilities/formatPhoneNumber';
import joi from 'joi';

export class ContactUpdated extends JoiValidationEntity {
  public address1: string;
  public address2?: string;
  public address3?: string;
  public city: string;
  public countryType: CountryTypes;
  public inCareOf?: string;
  public name: string;
  public phone: string;
  public placeOfLegalResidence: string;
  public postalCode: string;
  public state?: string;
  public petitionType: string;
  public partyType: string;
  public hasConsentedToEService?: boolean;

  constructor(
    rawContact,
    contactName: string,
    petitionType: string,
    partyType: string,
  ) {
    super(contactName);
    this.address1 = rawContact.address1;
    this.address2 = rawContact.address2 || undefined;
    this.address3 = rawContact.address3 || undefined;
    this.city = rawContact.city;
    this.countryType = rawContact.countryType;
    this.inCareOf = rawContact.inCareOf;
    this.name = rawContact.name;
    this.phone = formatPhoneNumber(rawContact.phone);
    this.postalCode = rawContact.postalCode;
    this.placeOfLegalResidence = rawContact.placeOfLegalResidence;
    this.state = rawContact.state;
    this.petitionType = petitionType;
    this.partyType = partyType;
    this.hasConsentedToEService = rawContact.hasConsentedToEService;
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
    inCareOf: JoiValidationConstants.STRING.max(100).optional(),
    name: JoiValidationConstants.STRING.max(100)
      .required()
      .messages({ '*': 'Enter name' }),
    phone: JoiValidationConstants.STRING.max(100)
      .required()
      .messages({ '*': 'Enter phone number' }),
    placeOfLegalResidence: JoiValidationConstants.STRING.valid(
      ...Object.keys(US_STATES),
      ...Object.keys(US_STATES_OTHER),
    )
      .when('petitionType', {
        is: 'autoGenerated',
        otherwise: joi.string().optional(),
        then: joi.required(),
      })
      .messages({ '*': 'Enter a place of legal residence' }),
  } as const;

  static DOMESTIC_VALIDATION_RULES = {
    countryType: JoiValidationConstants.STRING.valid(COUNTRY_TYPES.DOMESTIC)
      .required()
      .messages({ '*': 'Enter country type' }),
    ...ContactUpdated.SHARED_VALIDATION_RULES,
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
    ...ContactUpdated.SHARED_VALIDATION_RULES,
    postalCode: JoiValidationConstants.STRING.max(100)
      .required()
      .messages({ '*': 'Enter ZIP code' }),
  } as const;

  getValidationRules() {
    console.log('in get validation rules', this.countryType);
    return this.countryType === COUNTRY_TYPES.INTERNATIONAL
      ? ContactUpdated.INTERNATIONAL_VALIDATION_RULES
      : ContactUpdated.DOMESTIC_VALIDATION_RULES;
  }
}

export type RawContactUpdated = ExcludeMethods<ContactUpdated>;
