import { JoiValidationConstants } from '../JoiValidationConstants';
import { TrialSession } from './TrialSession';
import { setDefaultErrorMessages } from '@shared/business/entities/utilities/setDefaultErrorMessages';
import joi from 'joi';

export class NewTrialSession extends TrialSession {
  public trialClerkId: string;

  constructor(rawSession: RawNewTrialSession, { applicationContext }) {
    super(rawSession, { applicationContext });

    this.trialClerkId = rawSession.trialClerkId;
  }

  getErrorToMessageMap() {
    return {
      ...super.getErrorToMessageMap(),
      alternateTrialClerkName:
        'A valid alternate trial clerk name must be provided if "Other" is selected',
    };
  }

  getValidationRules() {
    return {
      ...TrialSession.validationRules.COMMON,
      alternateTrialClerkName: joi.when('trialClerkId', {
        is: 'Other',
        otherwise: joi.optional(),
        then: JoiValidationConstants.STRING.max(100).required(),
      }),
      startDate: JoiValidationConstants.ISO_DATE.min('now').required(),
    };
  }

  getValidationRules_NEW() {
    return {
      ...TrialSession.validationRules_NEW.COMMON,
      alternateTrialClerkName: joi
        .when('trialClerkId', {
          is: 'Other',
          otherwise: joi.optional(),
          then: JoiValidationConstants.STRING.max(100).required(),
        })
        .messages(
          setDefaultErrorMessages(
            'A valid alternate trial clerk name must be provided if "Other" is selected',
          ),
        ),
      startDate: JoiValidationConstants.ISO_DATE.min('now')
        .required()
        .messages(setDefaultErrorMessages('Enter a valid start date')),
    };
  }
}

export type RawNewTrialSession = ExcludeMethods<NewTrialSession>;
