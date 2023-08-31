import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';

export class PrimaryIssue extends JoiValidationEntity {
  public notes: string;

  constructor(rawProps) {
    super('PrimaryIssue');

    this.notes = rawProps.notes;
  }

  static VALIDATION_RULES = {
    notes: JoiValidationConstants.STRING.required(),
  };

  static VALIDATION_ERROR_MESSAGES = {
    notes: 'Add primary issue',
  };

  getValidationRules() {
    return PrimaryIssue.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return PrimaryIssue.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawPrimaryIssue = ExcludeMethods<PrimaryIssue>;
