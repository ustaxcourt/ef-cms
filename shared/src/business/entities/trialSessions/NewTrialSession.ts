import { JoiValidationConstants } from '../JoiValidationConstants';
import { TrialSession } from './TrialSession';
import joi from 'joi';

export class NewTrialSession extends TrialSession {
  public trialClerkId: string;

  constructor(rawSession: RawNewTrialSession) {
    super(rawSession);

    this.trialClerkId = rawSession.trialClerkId;
  }

  getValidationRules() {
    return {
      ...TrialSession.validationRules.COMMON,
      alternateTrialClerkName: joi
        .when('trialClerkId', {
          is: 'Other',
          otherwise: joi.optional(),
          then: JoiValidationConstants.STRING.max(100).required(),
        })
        .messages({
          '*': 'A valid alternate trial clerk name must be provided if "Other" is selected',
        }),
      estimatedEndDate: JoiValidationConstants.ISO_DATE.min(joi.ref('startDate'))
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
