const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const {
  User,
  userDecorator,
  userValidation,
  VALIDATION_ERROR_MESSAGES: USER_VALIDATION_ERROR_MESSAGES,
} = require('./User');

const EMPLOYER_OPTIONS = ['IRS', 'DOJ', 'Private'];
const PRACTITIONER_TYPE_OPTIONS = ['Attorney', 'Non-Attorney'];
const ADMISSIONS_STATUS_OPTIONS = [
  'Active',
  'Suspended',
  'Disbarred',
  'Resigned',
  'Deceased',
  'Inactive',
];

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
function Practitioner(rawUser) {
  this.init(rawUser);
}

const roleMap = {
  DOJ: User.ROLES.irsPractitioner,
  IRS: User.ROLES.irsPractitioner,
  Private: User.ROLES.privatePractitioner,
};

Practitioner.prototype.init = function (rawUser) {
  userDecorator(this, rawUser);
  this.name = rawUser.name || `${rawUser.firstName} ${rawUser.lastName}`;
  this.additionalPhone = rawUser.additionalPhone;
  this.admissionsDate = rawUser.admissionsDate;
  this.admissionsStatus = rawUser.admissionsStatus || 'Active';
  this.alternateEmail = rawUser.alternateEmail;
  this.birthYear = rawUser.birthYear;
  this.employer = rawUser.employer;
  this.firmName = rawUser.firmName;
  this.isAdmitted = rawUser.isAdmitted;
  this.originalBarState = rawUser.originalBarState;
  this.practitionerType = rawUser.practitionerType;
  if (this.isAdmitted) {
    this.role = roleMap[this.employer];
  } else {
    this.role = User.ROLES.inactivePractitioner;
  }
  this.section = this.role;
};

const VALIDATION_ERROR_MESSAGES = {
  ...USER_VALIDATION_ERROR_MESSAGES,
  admissionsDate: 'Enter an admission date',
  admissionsStatus: 'Select an admission status',
  barNumber: 'Bar number is required',
  birthYear: 'Enter a valid birth year',
  employer: 'Select an employer',
  originalBarState: 'Select an original bar state',
  practitionerType: 'Select a practitioner type',
};

const validationRules = {
  ...userValidation,
  additionalPhone: joi
    .string()
    .optional()
    .allow(null)
    .description('An alternate phone number for the practitioner.'),
  admissionsDate: joi
    .date()
    .iso()
    .max('now')
    .required()
    .description(
      'The date the practitioner was admitted to the Tax Court bar.',
    ),
  admissionsStatus: joi
    .string()
    .valid(...ADMISSIONS_STATUS_OPTIONS)
    .required()
    .description('The Tax Court bar admission status for the practitioner.'),
  alternateEmail: joi
    .string()
    .optional()
    .allow(null)
    .description('An alternate email address for the practitioner.'),
  barNumber: joi
    .string()
    .required()
    .description(
      'A unique identifier comprising of the practitioner initials, date, and series number.',
    ),
  birthYear: joi
    .number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required()
    .description('The year the practitioner was born'),
  employer: joi
    .string()
    .valid(...EMPLOYER_OPTIONS)
    .required()
    .description('The employer designation for the practitioner.'),
  firmName: joi
    .string()
    .optional()
    .allow(null)
    .description('The firm name for the practitioner.'),
  isAdmitted: joi
    .boolean()
    .required()
    .description('Whether the practitioner is admitted to the Tax Court bar.'),
  originalBarState: joi
    .string()
    .required()
    .description(
      'The state in which the practitioner passed their bar examination.',
    ),
  practitionerType: joi
    .string()
    .valid(...PRACTITIONER_TYPE_OPTIONS)
    .required()
    .description('The type of practitioner - either Attorney or Non-Attorney.'),
};

joiValidationDecorator(
  Practitioner,
  joi.object().keys({
    ...validationRules,
  }),
  undefined,
  VALIDATION_ERROR_MESSAGES,
);

Practitioner.validationName = 'Practitioner';

Practitioner.PRACTITIONER_TYPE_OPTIONS = PRACTITIONER_TYPE_OPTIONS;
Practitioner.EMPLOYER_OPTIONS = EMPLOYER_OPTIONS;
Practitioner.validationRules = validationRules;
Practitioner.VALIDATION_ERROR_MESSAGES = VALIDATION_ERROR_MESSAGES;
Practitioner.ADMISSIONS_STATUS_OPTIONS = ADMISSIONS_STATUS_OPTIONS;

module.exports = { Practitioner };
