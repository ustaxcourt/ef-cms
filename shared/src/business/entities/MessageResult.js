const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('./JoiValidationDecorator');
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
};

MessageResult.VALIDATION_ERROR_MESSAGES = {};

MessageResult.VALIDATION_RULES = {};

joiValidationDecorator(
  MessageResult,
  joi.object().keys(MessageResult.VALIDATION_RULES),
  MessageResult.VALIDATION_ERROR_MESSAGES,
);

exports.MessageResult = validEntityDecorator(MessageResult);
