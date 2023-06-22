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
  countryType: any;
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
    { countryType }: { countryType: string },
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

  static VALIDATION_RULES = {
    
  };

  static VALIDATION_ERROR_MESSAGES = {};

  getValidationRules() {}

  getErrorToMessageMap() {}
}
