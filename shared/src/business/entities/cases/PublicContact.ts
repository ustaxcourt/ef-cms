import {
  ADMISSIONS_STATUS_OPTIONS,
  CONTACT_TYPES,
  PRACTICE_TYPE_OPTIONS,
  PRACTITIONER_TYPE_OPTIONS,
  SERVICE_INDICATOR_TYPES,
} from '../EntityConstants';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';

export class PublicContact extends JoiValidationEntity {
  public admissionsDate?: string;
  public admissionsStatus?: string;
  public barNumber?: string;
  public contactId: string;
  public contactType?: string;
  public name?: string;
  public originalBarState?: string;
  public practiceType?: string;
  public practitionerType?: string;
  public serviceIndicator?: string;
  public state?: string;

  constructor(rawProps) {
    super('PublicContact');

    this.admissionsDate = rawProps.admissionsDate;
    this.admissionsStatus = rawProps.admissionsStatus;
    this.barNumber = rawProps.barNumber;
    this.contactId = rawProps.contactId || rawProps.userId;
    this.contactType = rawProps.contactType;
    this.name = rawProps.name;
    this.originalBarState = rawProps.originalBarState;
    this.practiceType = rawProps.practiceType;
    this.practitionerType = rawProps.practitionerType;
    this.serviceIndicator = rawProps.serviceIndicator;
    this.state = rawProps.state;
  }

  static VALIDATION_RULES = {
    admissionsDate: JoiValidationConstants.DATE.max('now').optional(),
    admissionsStatus: JoiValidationConstants.STRING.valid(
      ...ADMISSIONS_STATUS_OPTIONS,
    ).optional(),
    barNumber: JoiValidationConstants.STRING.max(100).optional(),
    contactId: JoiValidationConstants.UUID.required(),
    contactType: JoiValidationConstants.STRING.valid(
      ...Object.values(CONTACT_TYPES),
    ).optional(),
    name: JoiValidationConstants.STRING.max(500).optional(),
    originalBarState: JoiValidationConstants.STRING.optional(),
    practiceType: JoiValidationConstants.STRING.valid(
      ...PRACTICE_TYPE_OPTIONS,
    ).optional(),
    practitionerType: JoiValidationConstants.STRING.valid(
      ...PRACTITIONER_TYPE_OPTIONS,
    ).optional(),
    serviceIndicator: JoiValidationConstants.STRING.valid(
      ...Object.values(SERVICE_INDICATOR_TYPES),
    ).optional(),
    state: JoiValidationConstants.STRING.optional(),
  };

  getValidationRules() {
    return PublicContact.VALIDATION_RULES;
  }
}

export type RawPublicContact = ExcludeMethods<PublicContact>;
