import { JoiValidationEntity } from '../JoiValidationEntity';
const { CONTACT_TYPES } = require('../EntityConstants');
const { JoiValidationConstants } = require('../JoiValidationConstants');

export class PublicContact extends JoiValidationEntity {
  public entityName: string;
  public contactId: string;
  public contactType: string;
  public name: string;
  public state: string;

  constructor(
    rawContact: any,
    { applicationContext }: { applicationContext: IApplicationContext },
  ) {
    super('PublicContact');

    if (!applicationContext) {
      throw new TypeError('applicationContext must be defined');
    }

    this.entityName = 'PublicContact';
    this.contactId = rawContact.contactId;
    this.contactType = rawContact.contactType;
    this.name = rawContact.name;
    this.state = rawContact.state;
  }

  static VALIDATION_ERROR_MESSAGES = {
    contactId: 'Contact ID is required.',
  };

  static VALIDATION_RULES = {
    contactId: JoiValidationConstants.UUID.required(),
    contactType: JoiValidationConstants.STRING.valid(
      ...Object.values(CONTACT_TYPES),
    ).optional(),
    name: JoiValidationConstants.STRING.max(500).optional(),
    state: JoiValidationConstants.STRING.optional(),
  };

  getValidationRules() {
    return PublicContact.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return PublicContact.VALIDATION_ERROR_MESSAGES;
  }
}

declare global {
  type RawPublicContact = ExcludeMethods<PublicContact>;
}
