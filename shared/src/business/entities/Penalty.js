const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('./JoiValidationDecorator');
const { JoiValidationConstants } = require('./JoiValidationConstants');

/**
 * Penalty constructor
 *
 * @param {object} rawPenalty the raw statistic data
 * @constructor
 */
function Penalty() {
  this.entityName = 'Penalty';
}

Penalty.prototype.init = function init(rawProps, { applicationContext }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }

  this.name = rawProps.name;
  this.irsPenaltyAmount = rawProps.irsPenaltyAmount;
  this.determinationPenaltyAmount = rawProps.determinationPenaltyAmount;
  this.penaltyId = rawProps.penaltyId || applicationContext.getUniqueId();
  this.statisticId = rawProps.statisticId;
};

Penalty.VALIDATION_ERROR_MESSAGES = {
  irsPenaltyAmount: 'Enter penalty on IRS Notice',
  name: 'Name is required',
  statisticId: 'Statistic Id is required',
};

Penalty.VALIDATION_RULES = joi.object().keys({
  determinationPenaltyAmount: joi
    .number()
    .optional()
    .description('The Court determined amount of the penalty.'),
  entityName: JoiValidationConstants.STRING.valid('Penalty').required(),
  irsPenaltyAmount: joi
    .number()
    .required()
    .description('The IRS Notice amount of the penalty.'),
  name: JoiValidationConstants.STRING.max(50)
    .required()
    .description('Penalty name.'),
  penaltyId: JoiValidationConstants.UUID.required().description(
    'Unique Penalty ID only used by the system.',
  ),
  statisticId: JoiValidationConstants.UUID.required().description(
    'Unique statistic ID only used by the system.',
  ),
});

joiValidationDecorator(
  Penalty,
  Penalty.VALIDATION_RULES,
  Penalty.VALIDATION_ERROR_MESSAGES,
);

exports.Penalty = validEntityDecorator(Penalty);
