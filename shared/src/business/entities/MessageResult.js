const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('./JoiValidationDecorator');
const {
  TRIAL_CITY_STRINGS,
  TRIAL_LOCATION_MATCHER,
} = require('./EntityConstants');
const { JoiValidationConstants } = require('./JoiValidationConstants');
const { messageDecorator } = require('./Message');

/**
 * constructor
 *
 * @param {object} rawMessage the raw message data
 * @constructor
 */
function MessageResult() {
  this.entityName = 'MessageResult';
}

MessageResult.prototype.init = function init(
  rawMessage,
  { applicationContext },
) {
  messageDecorator(this, rawMessage, { applicationContext });
  this.trialDate = rawMessage.trialDate;
  this.trialLocation = rawMessage.trialLocation;
};

MessageResult.VALIDATION_RULES = {
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

joiValidationDecorator(
  MessageResult,
  joi.object().keys(MessageResult.VALIDATION_RULES),
  MessageResult.VALIDATION_ERROR_MESSAGES,
);

exports.MessageResult = validEntityDecorator(MessageResult);
