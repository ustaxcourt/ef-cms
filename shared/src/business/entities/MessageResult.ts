import { JoiValidationConstants } from './JoiValidationConstants';
import { Message } from './Message';
import { TRIAL_CITY_STRINGS, TRIAL_LOCATION_MATCHER } from './EntityConstants';
import joi from 'joi';

export class MessageResult extends Message {
  public trialDate: string;
  public trialLocation: string;

  constructor(rawMessage, { applicationContext }) {
    super(rawMessage, { applicationContext });

    this.entityName = 'MessageResult';
    this.trialDate = rawMessage.trialDate;
    this.trialLocation = rawMessage.trialLocation;
  }

  static VALIDATION_RULES = {
    entityName: JoiValidationConstants.STRING.valid('MessageResult').required(),
    trialDate: JoiValidationConstants.ISO_DATE.optional().description(
      'When this case goes to trial.',
    ),
    trialLocation: joi
      .alternatives()
      .try(
        JoiValidationConstants.STRING.valid(...TRIAL_CITY_STRINGS, null),
        JoiValidationConstants.STRING.pattern(TRIAL_LOCATION_MATCHER),
        JoiValidationConstants.STRING.valid('Standalone Remote'),
      )
      .optional()
      .description(
        'Where this case goes to trial. This may be different that the preferred trial location.',
      ),
  } as any;

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      ...MessageResult.VALIDATION_RULES,
    };
  }
}
