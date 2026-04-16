import { JoiValidationConstants } from '../JoiValidationConstants';
import { TrialSession } from './TrialSession';
import joi from 'joi';

export class NewTrialSession extends TrialSession {
  constructor(rawSession: RawNewTrialSession) {
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
      startDate: JoiValidationConstants.ISO_DATE.min('now')
        .required()
        .messages({ '*': 'Enter a valid start date' }),
    };
  }
}

export type RawNewTrialSession = ExcludeMethods<NewTrialSession>;
