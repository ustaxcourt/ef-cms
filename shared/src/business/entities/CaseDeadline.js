const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { createISODateString } = require('../utilities/DateHandler');
const { getTimestampSchema } = require('../../utilities/dateSchema');
const joiStrictTimestamp = getTimestampSchema();

/**
 * Case Deadline entity
 *
 * @param {object} rawProps the raw case deadline data
 * @constructor
 */
function CaseDeadline(rawProps, { applicationContext }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }
  this.entityName = 'CaseDeadline';

  this.caseDeadlineId =
    rawProps.caseDeadlineId || applicationContext.getUniqueId();
  this.caseId = rawProps.caseId;
  this.createdAt = rawProps.createdAt || createISODateString();
  this.deadlineDate = rawProps.deadlineDate;
  this.description = rawProps.description;
}

CaseDeadline.validationName = 'CaseDeadline';

CaseDeadline.VALIDATION_ERROR_MESSAGES = {
  caseId: 'You must have a case ID.',
  deadlineDate: 'Enter a valid deadline date',
  description: [
    {
      contains: 'length must be less than or equal to',
      message: 'The description is too long. Please enter a valid description.',
    },
    'Enter a description of this deadline',
  ],
};

CaseDeadline.schema = joi.object().keys({
  caseDeadlineId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required()
    .description('Unique Case Deadline ID only used by the system.'),
  caseId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required()
    .description('Unique Case ID only used by the system.'),
  createdAt: joiStrictTimestamp
    .required()
    .description('When the Case Deadline was added to the system.'),
  deadlineDate: joiStrictTimestamp
    .required()
    .description('When the Case Deadline expires.'),
  description: joi
    .string()
    .max(120)
    .min(1)
    .required()
    .description('User provided description of the Case Deadline.'),
  entityName: joi.string().valid('CaseDeadline').required(),
});

joiValidationDecorator(
  CaseDeadline,
  CaseDeadline.schema,
  undefined,
  CaseDeadline.VALIDATION_ERROR_MESSAGES,
);

module.exports = { CaseDeadline };
