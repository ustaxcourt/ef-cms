const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('./JoiValidationDecorator');
const { JoiValidationConstants } = require('./JoiValidationConstants');

/**
 * constructor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.rawStamp the raw stamp data
 * @constructor
 */
function Stamp() {
  this.entityName = 'Stamp';
}

Stamp.prototype.init = function init(rawStamp) {
  this.date = rawStamp.date;
  this.status = rawStamp.status;
};

Stamp.VALIDATION_ERROR_MESSAGES = {
  date: [
    {
      contains: 'must be greater than or equal to',
      message: 'Due date cannot be prior to today. Enter a valid date.',
    },
  ],
  status: 'Status is required.',
};

Stamp.schema = joi.object().keys({
  date: JoiValidationConstants.DATE.min('now')
    .optional()
    .allow(null)
    .description(
      'The due date of the status report (or proposed stipulated decision) filing',
    ),
  status: JoiValidationConstants.STRING.required()
    .valid('Granted', 'Denied')
    .description('Approval status of the motion'),
});

joiValidationDecorator(Stamp, Stamp.schema, Stamp.VALIDATION_ERROR_MESSAGES);

module.exports = { Stamp: validEntityDecorator(Stamp) };
