import { JoiValidationConstants } from '../JoiValidationConstants';
import { TrialSession } from './TrialSession';

export class EditTrialSession extends TrialSession {
  constructor(rawSession: RawEditTrialSession) {
    super(rawSession);
  }

  getValidationRules() {
    return {
      ...TrialSession.validationRules.COMMON,
      estimatedEndDate: JoiValidationConstants.ISO_DATE.optional().messages({
        '*': 'Enter a valid estimated end date',
      }),
    };
  }
}

export type RawEditTrialSession = ExcludeMethods<EditTrialSession>;
