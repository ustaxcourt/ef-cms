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

Practitioner.prototype.init = function (rawUser) {
  userDecorator(this, rawUser);
  this.additionalPhone = rawUser.additionalPhone;
  this.admissionsDate = rawUser.admissionsDate;
  this.admissionsStatus = rawUser.admissionsStatus || 'Active';
  this.alternateEmail = rawUser.alternateEmail;
  this.birthYear = rawUser.birthYear;
  this.employer = rawUser.employer;
  this.firmName = rawUser.firmName;
  this.isAdmitted = rawUser.isAdmitted;
  this.originalBarState = rawUser.originalBarState;
  this.role = rawUser.role || User.ROLES.privatePractitioner;
  this.practitionerType = rawUser.practitionerType;
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
  additionalPhone: joi.string().optional().allow(null),
  admissionsDate: joi.date().iso().max('now').required(),
  admissionsStatus: joi
    .string()
    .valid(...ADMISSIONS_STATUS_OPTIONS)
    .required(),
  alternateEmail: joi.string().optional().allow(null),
  barNumber: joi.string().required(),
  birthYear: joi
    .number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required(),
  employer: joi
    .string()
    .valid(...EMPLOYER_OPTIONS)
    .required(),
  firmName: joi.string().optional().allow(null),
  isAdmitted: joi.boolean().required(),
  originalBarState: joi.string().required(),
  practitionerType: joi
    .string()
    .valid(...PRACTITIONER_TYPE_OPTIONS)
    .required(),
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
