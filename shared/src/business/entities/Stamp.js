const joi = require('joi');
const {
  calculateISODate,
  createISODateString,
  formatDateString,
  FORMATS,
} = require('../utilities/DateHandler');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('./JoiValidationDecorator');
const { JoiValidationConstants } = require('./JoiValidationConstants');
const { MOTION_STATUSES } = require('./EntityConstants');

const yesterdayISO = calculateISODate({ howMuch: -1, units: 'days' });
const yesterdayFormatted = formatDateString(
  createISODateString(yesterdayISO),
  FORMATS.MMDDYYYY,
);
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
  this.dueDateMessage = rawStamp.dueDateMessage;
};

Stamp.VALIDATION_ERROR_MESSAGES = {
  date: [
    {
      contains: 'must be greater than or equal to',
      message: 'Due date cannot be prior to today. Enter a valid date.',
    },
    'Enter a valid date',
  ],
  status: 'Enter a status',
};

Stamp.schema = joi.object().keys({
  date: joi.when('dueDateMessage', {
    is: joi.exist().not(null),
    otherwise: joi.optional().allow(null),
    then: JoiValidationConstants.ISO_DATE.min(yesterdayFormatted)
      .required()
      .description(
        'The due date of the status report (or proposed stipulated decision) filing',
      ),
  }),
  dueDateMessage: joi.optional().allow(null),
  status: JoiValidationConstants.STRING.valid(...Object.values(MOTION_STATUSES))
    .description('Approval status of the motion')
    .required(),
});

joiValidationDecorator(Stamp, Stamp.schema, Stamp.VALIDATION_ERROR_MESSAGES);

module.exports = { Stamp: validEntityDecorator(Stamp) };
