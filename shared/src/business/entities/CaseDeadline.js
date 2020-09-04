const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { createISODateString } = require('../utilities/DateHandler');

/**
 * Case Deadline entity
 *
 * @param {object} rawProps the raw case deadline data
 * @constructor
 */
function CaseDeadline() {
  this.entityName = 'CaseDeadline';
}

CaseDeadline.prototype.init = function init(rawProps, { applicationContext }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }

  this.caseDeadlineId =
    rawProps.caseDeadlineId || applicationContext.getUniqueId();
  this.createdAt = rawProps.createdAt || createISODateString();
  this.deadlineDate = rawProps.deadlineDate;
  this.description = rawProps.description;
  this.docketNumber = rawProps.docketNumber;
};

CaseDeadline.validationName = 'CaseDeadline';

CaseDeadline.VALIDATION_ERROR_MESSAGES = {
  deadlineDate: 'Enter a valid deadline date',
  description: [
    {
      contains: 'length must be less than or equal to',
      message: 'The description is too long. Please enter a valid description.',
    },
    'Enter a description of this deadline',
  ],
  docketNumber: 'You must have a docket number.',
};

CaseDeadline.schema = joi.object().keys({
  caseDeadlineId: JoiValidationConstants.UUID.required().description(
    'Unique Case Deadline ID only used by the system.',
  ),
  createdAt: JoiValidationConstants.ISO_DATE.required().description(
    'When the Case Deadline was added to the system.',
  ),
  deadlineDate: JoiValidationConstants.ISO_DATE.required().description(
    'When the Case Deadline expires.',
  ),
  description: JoiValidationConstants.STRING.max(120)
    .min(1)
    .required()
    .description('User provided description of the Case Deadline.'),
  docketNumber: JoiValidationConstants.DOCKET_NUMBER.required().description(
    'Docket number of the case containing the Case Deadline.',
  ),
  entityName: JoiValidationConstants.STRING.valid('CaseDeadline').required(),
});

joiValidationDecorator(
  CaseDeadline,
  CaseDeadline.schema,
  CaseDeadline.VALIDATION_ERROR_MESSAGES,
);

module.exports = { CaseDeadline: validEntityDecorator(CaseDeadline) };
