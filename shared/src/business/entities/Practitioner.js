const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { userDecorator, userValidation } = require('./User');

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
  userDecorator(this, rawUser);
  this.additionalPhone = rawUser.additionalPhone;
  this.admissionsDate = rawUser.admissionsDate;
  this.admissionsStatus = rawUser.admissionsStatus;
  this.alternateEmail = rawUser.alternateEmail;
  this.birthYear = rawUser.birthYear;
  this.employer = rawUser.employer;
  this.firmName = rawUser.firmName;
  this.isAdmitted = rawUser.isAdmitted;
  this.originalBarState = rawUser.originalBarState;
  this.practitionerType = rawUser.practitionerType;
}

joiValidationDecorator(
  Practitioner,
  joi.object().keys({
    ...userValidation,
    additionalPhone: joi.string().optional().allow(null),
    admissionsDate: joi.date().iso().max('now').required(),
    admissionsStatus: joi
      .string()
      .valid(...ADMISSIONS_STATUS_OPTIONS)
      .required(),
    alternateEmail: joi.string().optional().allow(null),
    birthYear: joi.number().required(),
    employer: joi
      .string()
      .valid(...EMPLOYER_OPTIONS)
      .required(),
    firmName: joi.string().optional().allow(null),
    isAdmitted: joi.boolean().required(),
    originalBarState: joi.string().optional().allow(null),
    practitionerType: joi
      .string()
      .valid(...PRACTITIONER_TYPE_OPTIONS)
      .required(),
  }),
  undefined,
  {},
);

Practitioner.validationName = 'Practitioner';

module.exports = { Practitioner };
