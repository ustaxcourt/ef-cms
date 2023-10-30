import { JoiValidationConstants } from './JoiValidationConstants';
import { Message } from './Message';
import { TRIAL_CITY_STRINGS, TRIAL_LOCATION_MATCHER } from './EntityConstants';
import joi from 'joi';

/**
 * constructor
 *
 * @param {object} rawMessage the raw message data
 * @constructor
 */
export class MessageResult extends Message {
  public trialDate: string;
  public trialLocation: string;

  constructor(rawMessage, { applicationContext }) {
    super(rawMessage, { applicationContext });
    this.entityName = 'MessageResult';
    this.trialDate = rawMessage.trialDate;
    this.trialLocation = rawMessage.trialLocation;
  }

  static MESSAGE_RESULTS_VALIDATION_RULES = {
    entityName: JoiValidationConstants.STRING.valid('MessageResult').required(),
    trialDate: joi
      .alternatives()
      .optional()
      .description('When this case goes to trial.'),
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
  };

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      ...MessageResult.MESSAGE_RESULTS_VALIDATION_RULES,
    } as any;
  }

  getValidationRules_NEW() {
    return {
      ...super.getValidationRules_NEW(),
      ...MessageResult.MESSAGE_RESULTS_VALIDATION_RULES,
    } as any;
  }
}
