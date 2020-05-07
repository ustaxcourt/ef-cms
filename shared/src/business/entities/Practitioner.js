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
const { getTimestampSchema } = require('../../utilities/dateSchema');
const { omit } = require('lodash');
const joiStrictTimestamp = getTimestampSchema();
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
  this.entityName = 'Practitioner';
  this.name = Practitioner.getFullName(rawUser);
  this.firstName = rawUser.firstName;
  this.lastName = rawUser.lastName;
  this.middleName = rawUser.middleName;
  this.additionalPhone = rawUser.additionalPhone;
  this.admissionsDate = rawUser.admissionsDate;
  this.admissionsStatus = rawUser.admissionsStatus;
  this.alternateEmail = rawUser.alternateEmail;
  this.birthYear = rawUser.birthYear;
  this.employer = rawUser.employer;
  this.firmName = rawUser.firmName;
  this.originalBarState = rawUser.originalBarState;
  this.practitionerType = rawUser.practitionerType;
  if (this.admissionsStatus === 'Active') {
    this.role = roleMap[this.employer];
  } else {
    this.role = User.ROLES.inactivePractitioner;
  }
  this.suffix = rawUser.suffix;
  this.section = this.role;
};

const VALIDATION_ERROR_MESSAGES = {
  ...USER_VALIDATION_ERROR_MESSAGES,
  admissionsDate: [
    {
      contains: 'must be less than or equal to',
      message: 'Admission date cannot be in the future. Enter a valid date.',
    },
    'Enter an admission date',
  ],
  admissionsStatus: 'Select an admission status',
  barNumber: 'Bar number is required',
  birthYear: [
    {
      contains: 'must be less than or equal to',
      message: 'Birth year cannot be in the future. Enter a valid year.',
    },
    'Enter a valid birth year',
  ],
  employer: 'Select an employer',
  originalBarState: 'Select an original bar state',
  practitionerType: 'Select a practitioner type',
};

const practitionerValidation = {
  ...userValidation,
  additionalPhone: joi
    .string()
    .optional()
    .allow(null)
    .description('An alternate phone number for the practitioner.'),
  admissionsDate: joiStrictTimestamp
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
    .description('The year the practitioner was born.'),
  employer: joi
    .string()
    .valid(...EMPLOYER_OPTIONS)
    .required()
    .description('The employer designation for the practitioner.'),
  entityName: joi.string().valid('Practitioner').required(),
  firmName: joi
    .string()
    .optional()
    .allow(null)
    .description('The firm name for the practitioner.'),
  firstName: joi
    .string()
    .required()
    .description('The first name of the practitioner.'),
  lastName: joi
    .string()
    .required()
    .description('The last name of the practitioner.'),
  middleName: joi
    .string()
    .optional()
    .allow(null)
    .description('The optional middle name of the practitioner.'),
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
  role: joi.alternatives().conditional('admissionsStatus', {
    is: joi.valid('Active'),
    otherwise: joi.string().valid(User.ROLES.inactivePractitioner).required(),
    then: joi
      .string()
      .valid(...[User.ROLES.irsPractitioner, User.ROLES.privatePractitioner])
      .required(),
  }),
  suffix: joi
    .string()
    .optional()
    .allow('')
    .description('The name suffix of the practitioner.'),
};

joiValidationDecorator(
  Practitioner,
  joi.object().keys({
    ...practitionerValidation,
  }),
  VALIDATION_ERROR_MESSAGES,
);

Practitioner.validationName = 'Practitioner';

Practitioner.PRACTITIONER_TYPE_OPTIONS = PRACTITIONER_TYPE_OPTIONS;
Practitioner.EMPLOYER_OPTIONS = EMPLOYER_OPTIONS;
Practitioner.validationRules = practitionerValidation;
Practitioner.VALIDATION_ERROR_MESSAGES = VALIDATION_ERROR_MESSAGES;
Practitioner.ADMISSIONS_STATUS_OPTIONS = ADMISSIONS_STATUS_OPTIONS;

/**
 * returns the full concatenated name for the given practitioner data
 *
 * @param {object} practitionerData data to pull name parts from
 * @returns {string} the concatenated firstName, middleName, and lastName with suffix
 */
Practitioner.getFullName = function (practitionerData) {
  const { firstName, lastName } = practitionerData;
  const middleName = practitionerData.middleName
    ? ' ' + practitionerData.middleName
    : '';
  const suffix = practitionerData.suffix ? ' ' + practitionerData.suffix : '';

  return `${firstName}${middleName} ${lastName}${suffix}`;
};

module.exports = {
  Practitioner,
};
