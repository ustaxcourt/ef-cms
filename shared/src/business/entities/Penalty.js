const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('./JoiValidationDecorator');
const { JoiValidationConstants } = require('./JoiValidationConstants');
const { PENALTY_TYPES } = require('./EntityConstants');

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
  this.penaltyType = rawProps.penaltyType;
  this.penaltyAmount = rawProps.penaltyAmount;
  this.penaltyId = rawProps.penaltyId || applicationContext.getUniqueId();
  this.statisticId = rawProps.statisticId;
};

Penalty.VALIDATION_ERROR_MESSAGES = {
  name: 'Penalty name is required.',
  penaltyAmount: 'Enter penalty amount.',
  penaltyType: 'Penalty type is required.',
  statisticId: 'Statistic ID is required.',
};

Penalty.VALIDATION_RULES = joi.object().keys({
  entityName: JoiValidationConstants.STRING.valid('Penalty').required(),
  name: JoiValidationConstants.STRING.max(50)
    .required()
    .description('Penalty name.'),
  penaltyAmount: joi
    .number()
    .positive()
    .allow(0)
    .required()
    .description('The dollar amount of the penalty.'),
  penaltyId: JoiValidationConstants.UUID.required().description(
    'Unique Penalty ID only used by the system.',
  ),
  penaltyType: JoiValidationConstants.STRING.required()
    .valid(...Object.values(PENALTY_TYPES))
    .description('The type of penalty (IRS or Court Determination).'),
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
