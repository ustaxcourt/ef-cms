import { JoiValidationConstants } from '../JoiValidationConstants';
import { TrialSession } from './TrialSession';
import joi from 'joi';

export class EditTrialSession extends TrialSession {
  constructor(rawSession: RawEditTrialSession) {
    super(rawSession);
  }

  getValidationRules() {
    return {
      ...TrialSession.validationRules.COMMON,
      estimatedEndDate: JoiValidationConstants.ISO_DATE.min(
        joi.ref('startDate'),
      )
        .optional()
        .allow(null)
        .messages({
          '*': 'Enter a valid estimated end date',
          'date.min': 'Estimated end date must be after start date',
        }),
    };
  }
}

export type RawEditTrialSession = ExcludeMethods<EditTrialSession>;
