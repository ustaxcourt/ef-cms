const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../JoiValidationDecorator');
const { CASE_TYPES, DOCKET_NUMBER_SUFFIXES } = require('../EntityConstants');
const { IrsPractitioner } = require('../IrsPractitioner');
const { JoiValidationConstants } = require('../JoiValidationConstants');
const { PrivatePractitioner } = require('../PrivatePractitioner');

/**
 * Eligible Case Entity
 * Represents an eligible case on a trial session
 *
 * @param {object} rawCase the raw case data
 * @constructor
 */
function EligibleCase() {}
EligibleCase.prototype.init = function init(rawCase) {
  this.entityName = 'EligibleCase';
  this.caseCaption = rawCase.caseCaption;
  this.docketNumber = rawCase.docketNumber;
  this.leadDocketNumber = rawCase.leadDocketNumber;
  this.docketNumberSuffix = rawCase.docketNumberSuffix;
  this.docketNumberWithSuffix =
    rawCase.docketNumber + (rawCase.docketNumberSuffix || '');
  this.highPriority = rawCase.highPriority;
  this.caseType = rawCase.caseType;
  this.qcCompleteForTrial = rawCase.qcCompleteForTrial || {};

  if (Array.isArray(rawCase.privatePractitioners)) {
    this.privatePractitioners = rawCase.privatePractitioners.map(
      practitioner => new PrivatePractitioner(practitioner),
    );
  } else {
    this.privatePractitioners = [];
  }

  if (Array.isArray(rawCase.irsPractitioners)) {
    this.irsPractitioners = rawCase.irsPractitioners.map(
      practitioner => new IrsPractitioner(practitioner),
    );
  } else {
    this.irsPractitioners = [];
  }
};

const eligibleCaseSchema = {
  caseCaption: JoiValidationConstants.CASE_CAPTION.optional(),
  caseType: JoiValidationConstants.STRING.valid(...CASE_TYPES).required(),
  docketNumber: JoiValidationConstants.DOCKET_NUMBER.required().description(
    'Unique case identifier in XXXXX-YY format.',
  ),
  docketNumberSuffix: JoiValidationConstants.STRING.allow(null)
    .valid(...Object.values(DOCKET_NUMBER_SUFFIXES))
    .optional(),
  docketNumberWithSuffix: JoiValidationConstants.STRING.optional().description(
    'Auto-generated from docket number and the suffix.',
  ),
  highPriority: joi
    .boolean()
    .optional()
    .meta({ tags: ['Restricted'] }),
  irsPractitioners: joi
    .array()
    .items(IrsPractitioner.VALIDATION_RULES)
    .optional()
    .description(
      'List of IRS practitioners (also known as respondents) associated with the case.',
    ),
  privatePractitioners: joi
    .array()
    .items(PrivatePractitioner.VALIDATION_RULES)
    .optional()
    .description('List of private practitioners associated with the case.'),
  qcCompleteForTrial: joi
    .object()
    .optional()
    .meta({ tags: ['Restricted'] })
    .description(
      'QC Checklist object that must be completed before the case can go to trial.',
    ),
};

joiValidationDecorator(EligibleCase, joi.object(eligibleCaseSchema), {});

module.exports = {
  EligibleCase: validEntityDecorator(EligibleCase),
};
