const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { Case, caseDecorator } = require('./Case');

CaseQC.VALIDATION_ERROR_MESSAGES = {
  ...Case.VALIDATION_ERROR_MESSAGES,
  hasVerifiedIrsNotice: 'Select an option',
};

/**
 * CaseQC Entity
 * Represents a Case that is being QCed
 *
 * @param {object} rawCase the raw case data
 * @constructor
 */
function CaseQC() {
  this.entityName = 'CaseQC';
}

CaseQC.prototype.init = function init(
  rawCase,
  { applicationContext, filtered = false },
) {
  caseDecorator(this, rawCase, { applicationContext, filtered });
};

CaseQC.VALIDATION_RULES = {
  ...Case.VALIDATION_RULES,
  entityName: JoiValidationConstants.STRING.valid('CaseQC').required(),
  hasVerifiedIrsNotice: joi
    .boolean()
    .required()
    .description(
      'Whether the petitioner received an IRS notice, verified by the petitions clerk.',
    ),
};

joiValidationDecorator(
  CaseQC,
  joi.object().keys(CaseQC.VALIDATION_RULES),
  CaseQC.VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  CaseQC: validEntityDecorator(CaseQC),
};
