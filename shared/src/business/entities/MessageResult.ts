import { Message } from './Message';

const joi = require('joi');
const {
  TRIAL_CITY_STRINGS,
  TRIAL_LOCATION_MATCHER,
} = require('./EntityConstants');
const { JoiValidationConstants } = require('./JoiValidationConstants');

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
}
