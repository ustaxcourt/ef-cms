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
        .required()
        .messages({
          '*': 'Enter a valid estimated end date',
          'date.min': 'Enter a valid estimated end date',
        }),
    };
  }
}

export type RawEditTrialSession = ExcludeMethods<EditTrialSession>;
