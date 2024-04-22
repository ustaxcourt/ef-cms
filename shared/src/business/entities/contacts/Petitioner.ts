import { CONTACT_TYPES, SERVICE_INDICATOR_TYPES } from '../EntityConstants';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { User } from '@shared/business/entities/User';
import { formatPhoneNumber } from '../../utilities/formatPhoneNumber';
import joi from 'joi';

export class Petitioner extends JoiValidationEntity {
  public additionalName?: string;
  public address1: string;
  public address2?: string;
  public address3?: string;
  public city: string;
  public contactId?: string;
  public contactType: string;
  public country?: string;
  public countryType: string;
  public email?: string;
  public paperPetitionEmail?: string;
  public hasConsentedToEService?: string;
  public hasEAccess?: boolean;
  public inCareOf?: string;
  public isAddressSealed: boolean;
  public name: string;
  public phone: string;
  public postalCode: string;
  public sealedAndUnavailable?: boolean;
  public secondaryName?: string;
  public serviceIndicator?: string;
  public state?: string;
  public title?: string;

  constructor(
    rawProps,
    { applicationContext }: { applicationContext: IApplicationContext },
  ) {
    super('Petitioner');

    if (!applicationContext) {
      throw new TypeError('applicationContext must be defined');
    }

    this.additionalName = rawProps.additionalName;
    this.address1 = rawProps.address1;
    this.address2 = rawProps.address2 || undefined;
    this.address3 = rawProps.address3 || undefined;
    this.city = rawProps.city;
    this.contactId = rawProps.contactId || applicationContext.getUniqueId();
    this.contactType = rawProps.contactType;
    this.country = rawProps.country;
    this.countryType = rawProps.countryType;
    this.email = rawProps.email;
    this.paperPetitionEmail = rawProps.paperPetitionEmail;
    this.hasConsentedToEService = rawProps.hasConsentedToEService;
    this.hasEAccess = rawProps.hasEAccess || undefined;
    this.inCareOf = rawProps.inCareOf;
    this.isAddressSealed = rawProps.isAddressSealed || false;
    this.name = rawProps.name;
    this.phone = formatPhoneNumber(rawProps.phone);
    this.postalCode = rawProps.postalCode;
    this.sealedAndUnavailable = rawProps.sealedAndUnavailable || false;
    this.secondaryName = rawProps.secondaryName;
    this.serviceIndicator = rawProps.serviceIndicator;
    this.state = rawProps.state;
    this.title = rawProps.title;
  }

  static VALIDATION_RULES = {
    ...User.USER_CONTACT_VALIDATION_RULES,
    additionalName: JoiValidationConstants.STRING.max(200).optional().messages({
      'string.max': 'Limit is 200 characters. Enter 200 or fewer characters.',
    }),
    contactId: JoiValidationConstants.UUID.required().description(
      'Unique contact ID only used by the system.',
    ),
    contactType: JoiValidationConstants.STRING.valid(
      ...Object.values(CONTACT_TYPES),
    )
      .required()
      .messages({ '*': 'Select a role type' }),
    email: JoiValidationConstants.EMAIL.when('hasEAccess', {
      is: true,
      otherwise: joi.optional(),
      then: joi.required(),
    }),
    hasConsentedToEService: joi
      .boolean()
      .optional()
      .description(
        'Flag that indicates the petitioner has consented to receive electronic service on a paper petition',
      ),
    hasEAccess: joi
      .boolean()
      .optional()
      .description(
        'Flag that indicates if the petitioner has credentials to both the legacy and new system.',
      ),
    inCareOf: JoiValidationConstants.STRING.max(100).optional(),
    isAddressSealed: joi.boolean().required(),
    name: JoiValidationConstants.STRING.max(100).required().messages({
      '*': 'Enter name',
      'string.max': 'Limit is 100 characters. Enter 100 or fewer characters.',
    }),
    paperPetitionEmail: JoiValidationConstants.EMAIL.optional().description(
      'Email provided by the petitioner on a paper petition',
    ),
    sealedAndUnavailable: joi.boolean().optional(),
    serviceIndicator: JoiValidationConstants.STRING.valid(
      ...Object.values(SERVICE_INDICATOR_TYPES),
    )
      .required()
      .messages({ '*': 'Select a service indicator' }),
    title: JoiValidationConstants.STRING.max(100).optional(),
  };

  getValidationRules() {
    return Petitioner.VALIDATION_RULES;
  }
}

export type RawPetitioner = ExcludeMethods<Petitioner>;
