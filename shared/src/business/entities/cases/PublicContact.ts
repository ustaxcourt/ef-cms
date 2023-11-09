import { CONTACT_TYPES } from '../EntityConstants';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';

export class PublicContact extends JoiValidationEntity {
  public contactId: string;
  public contactType?: string;
  public name?: string;
  public state?: string;

  constructor(rawProps) {
    super('PublicContact');

    this.contactId = rawProps.contactId;
    this.contactType = rawProps.contactType;
    this.name = rawProps.name;
    this.state = rawProps.state;
  }

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
}

export type RawPublicContact = ExcludeMethods<PublicContact>;
