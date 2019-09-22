const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { createISODateString } = require('../utilities/DateHandler');

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
  this.caseDeadlineId =
    rawProps.caseDeadlineId || applicationContext.getUniqueId();
  this.caseId = rawProps.caseId;
  this.createdAt = rawProps.createdAt || createISODateString();
  this.description = rawProps.description;
  this.deadlineDate = rawProps.deadlineDate;
}

CaseDeadline.VALIDATION_ERROR_MESSAGES = {
  caseId: '#You must have a case id.',
  deadlineDate: '#Enter a valid deadline date',
  description: [
    {
      contains: 'length must be less than or equal to',
      message:
        '#The description is too long. Please enter a valid description.',
    },
    '#Enter a description of this deadline',
  ],
};

CaseDeadline.schema = joi.object().keys({
  caseDeadlineId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required(),
  caseId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required(),
  createdAt: joi
    .date()
    .iso()
    .required(),
  deadlineDate: joi
    .date()
    .iso()
    .required(),
  description: joi
    .string()
    .max(120)
    .required(),
});

joiValidationDecorator(
  CaseDeadline,
  CaseDeadline.schema,
  undefined,
  CaseDeadline.VALIDATION_ERROR_MESSAGES,
);

module.exports = { CaseDeadline };
