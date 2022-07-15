const joi = require('joi');
const {
  formatDateString,
  FORMATS,
  getMidnightIsoDateString,
} = require('../utilities/DateHandler');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('./JoiValidationDecorator');
const { JoiValidationConstants } = require('./JoiValidationConstants');
const { JURISDICTION_OPTIONS, MOTION_STATUSES } = require('./EntityConstants');

const todayFormatted = formatDateString(
  getMidnightIsoDateString(),
  FORMATS.ISO,
);

/**
 * constructor
 *
 * @param {object} providers the providers object
 * @param {object} providers.rawStamp the raw stamp data
 * @constructor
 */
function Stamp() {
  this.entityName = 'Stamp';
}

Stamp.prototype.init = function init(rawStamp) {
  this.date = rawStamp.date;
  this.status = rawStamp.status;
  this.deniedAsMoot = rawStamp.deniedAsMoot;
  this.deniedWithoutPrejudice = rawStamp.deniedWithoutPrejudice;
  this.strickenCase = rawStamp.strickenCase;
  this.jurisdictionOption = rawStamp.jurisdictionOption;
  this.dueDateMessage = rawStamp.dueDateMessage;
  this.customOrderText = rawStamp.customOrderText;
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
  customOrderText: JoiValidationConstants.STRING.max(60).optional(),
  date: joi.when('dueDateMessage', {
    is: joi.exist().not(null),
    otherwise: joi.optional().allow(null),
    then: JoiValidationConstants.ISO_DATE.min(todayFormatted)
      .required()
      .description(
        'The due date of the status report (or proposed stipulated decision) filing',
      ),
  }),
  deniedAsMoot: joi.boolean().optional().allow(null),
  deniedWithoutPrejudice: joi.boolean().optional().allow(null),
  dueDateMessage: joi.optional().allow(null),
  jurisdictionOption: JoiValidationConstants.STRING.valid(
    ...Object.values(JURISDICTION_OPTIONS),
  ),
  status: JoiValidationConstants.STRING.valid(...Object.values(MOTION_STATUSES))
    .description('Approval status of the motion')
    .required(),
  strickenCase: joi.boolean().optional().allow(null),
});

joiValidationDecorator(Stamp, Stamp.schema, Stamp.VALIDATION_ERROR_MESSAGES);

module.exports = { Stamp: validEntityDecorator(Stamp) };
