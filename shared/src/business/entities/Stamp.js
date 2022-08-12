const joi = require('joi');
const {
  createISODateAtStartOfDayEST,
  formatDateString,
  FORMATS,
} = require('../utilities/DateHandler');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('./JoiValidationDecorator');
const {
  JURISDICTIONAL_OPTIONS,
  MOTION_DISPOSITIONS,
  STRICKEN_FROM_TRIAL_SESSION_MESSAGE,
} = require('./EntityConstants');
const { JoiValidationConstants } = require('./JoiValidationConstants');

const todayFormatted = formatDateString(
  createISODateAtStartOfDayEST(),
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
  this.disposition = rawStamp.disposition;
  this.deniedAsMoot = rawStamp.deniedAsMoot;
  this.deniedWithoutPrejudice = rawStamp.deniedWithoutPrejudice;
  this.strickenFromTrialSession = rawStamp.strickenFromTrialSession;
  this.jurisdictionalOption = rawStamp.jurisdictionalOption;
  this.dueDateMessage = rawStamp.dueDateMessage;
  this.customText = rawStamp.customText;
};

Stamp.VALIDATION_ERROR_MESSAGES = {
  date: [
    {
      contains: 'must be greater than or equal to',
      message: 'Due date cannot be prior to today. Enter a valid date.',
    },
    'Enter a valid date',
  ],
  disposition: 'Enter a disposition',
};

Stamp.schema = joi.object().keys({
  customText: JoiValidationConstants.STRING.max(60).optional().allow(''),
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
  disposition: JoiValidationConstants.STRING.valid(
    ...Object.values(MOTION_DISPOSITIONS),
  ).required(),
  dueDateMessage: joi.optional().allow(null),
  jurisdictionalOption: JoiValidationConstants.STRING.valid(
    ...Object.values(JURISDICTIONAL_OPTIONS),
  ),
  strickenFromTrialSession: JoiValidationConstants.STRING.valid(
    STRICKEN_FROM_TRIAL_SESSION_MESSAGE,
  )
    .optional()
    .allow(null),
});

joiValidationDecorator(Stamp, Stamp.schema, Stamp.VALIDATION_ERROR_MESSAGES);

module.exports = { Stamp: validEntityDecorator(Stamp) };
