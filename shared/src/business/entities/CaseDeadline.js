const joi = require('joi-browser');
const uuid = require('uuid');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

/**
 * Case Deadline Entity
 *
 * @param rawProps
 * @constructor
 */
function CaseDeadline(rawProps) {
  this.caseDeadlineId = rawProps.caseDeadlineId || uuid.v4();
  this.caseId = rawProps.caseId;
  this.createdAt = rawProps.createdAt || new Date().toISOString();
  this.description = rawProps.description;
  this.deadlineDate = rawProps.deadlineDate;
}

CaseDeadline.errorToMessageMap = {
  caseId: 'You must have a case id.',
  deadlineDate: 'Please enter a valid deadline date.',
  description: [
    {
      contains: 'length must be less than or equal to',
      message: 'The description is too long. Please enter a valid description.',
    },
    'Please enter a description.',
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
  CaseDeadline.errorToMessageMap,
);

module.exports = { CaseDeadline };
