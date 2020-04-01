const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { Case } = require('./cases/Case');
const { createISODateString } = require('../utilities/DateHandler');
const { DOCKET_NUMBER_MATCHER } = require('./cases/CaseConstants');

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
  this.associatedJudge = rawProps.associatedJudge || Case.CHIEF_JUDGE;
  this.caseDeadlineId =
    rawProps.caseDeadlineId || applicationContext.getUniqueId();
  this.caseId = rawProps.caseId;
  this.caseTitle = rawProps.caseTitle;
  this.createdAt = rawProps.createdAt || createISODateString();
  this.deadlineDate = rawProps.deadlineDate;
  this.description = rawProps.description;
  this.docketNumber = rawProps.docketNumber;
  this.docketNumberSuffix = rawProps.docketNumberSuffix;
}

CaseDeadline.validationName = 'CaseDeadline';

CaseDeadline.VALIDATION_ERROR_MESSAGES = {
  caseId: 'You must have a case ID.',
  caseTitle: 'You must have a case title.',
  deadlineDate: 'Enter a valid deadline date',
  description: [
    {
      contains: 'length must be less than or equal to',
      message: 'The description is too long. Please enter a valid description.',
    },
    'Enter a description of this deadline',
  ],
  docketNumber: 'Enter a valid docket number',
};

CaseDeadline.schema = joi.object().keys({
  associatedJudge: joi
    .string()
    .required()
    .description('Judge assigned to this Case. Defaults to Chief Judge.'),
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
  caseTitle: joi.string().min(1).required().description('Title of the Case.'),
  createdAt: joi
    .date()
    .iso()
    .required()
    .description('When the Case Deadline was added to the system.'),
  deadlineDate: joi
    .date()
    .iso()
    .required()
    .description('When the Case Deadline expires.'),
  description: joi
    .string()
    .max(120)
    .min(1)
    .required()
    .description('User provided description of the Case Deadline.'),
  docketNumber: joi
    .string()
    .regex(DOCKET_NUMBER_MATCHER)
    .required()
    .description('Unique Case ID in XXXXX-YY format.'),
  docketNumberSuffix: joi.string().optional().allow(null),
});

joiValidationDecorator(
  CaseDeadline,
  CaseDeadline.schema,
  undefined,
  CaseDeadline.VALIDATION_ERROR_MESSAGES,
);

module.exports = { CaseDeadline };
