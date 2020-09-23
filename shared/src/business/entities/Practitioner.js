const joi = require('joi');
const {
  ADMISSIONS_STATUS_OPTIONS,
  EMPLOYER_OPTIONS,
  PRACTITIONER_TYPE_OPTIONS,
  ROLES,
} = require('./EntityConstants');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../utilities/JoiValidationDecorator');
const {
  userDecorator,
  userValidation,
  VALIDATION_ERROR_MESSAGES: USER_VALIDATION_ERROR_MESSAGES,
} = require('./User');

const entityName = 'Practitioner';

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
function Practitioner() {
  this.entityName = entityName;
}

Practitioner.prototype.init = function init(rawUser) {
  userDecorator(this, rawUser);
  this.additionalPhone = rawUser.additionalPhone;
  this.admissionsDate = rawUser.admissionsDate;
  this.admissionsStatus = rawUser.admissionsStatus;
  this.alternateEmail = rawUser.alternateEmail;
  this.barNumber = rawUser.barNumber;
  this.birthYear = rawUser.birthYear;
  this.employer = rawUser.employer;
  this.firmName = rawUser.firmName;
  this.firstName = rawUser.firstName;
  this.lastName = rawUser.lastName;
  this.middleName = rawUser.middleName;
  this.name = Practitioner.getFullName(rawUser);
  this.originalBarState = rawUser.originalBarState;
  this.practitionerType = rawUser.practitionerType;
  this.section = this.role;
  this.suffix = rawUser.suffix;
  if (this.admissionsStatus === 'Active') {
    this.role = roleMap[this.employer];
  } else {
    this.role = ROLES.inactivePractitioner;
  }
};

const roleMap = {
  DOJ: ROLES.irsPractitioner,
  IRS: ROLES.irsPractitioner,
  Private: ROLES.privatePractitioner,
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
  additionalPhone: JoiValidationConstants.STRING.max(100)
    .optional()
    .allow(null)
    .description('An alternate phone number for the practitioner.'),
  admissionsDate: JoiValidationConstants.ISO_DATE.max('now')
    .required()
    .description(
      'The date the practitioner was admitted to the Tax Court bar.',
    ),
  admissionsStatus: JoiValidationConstants.STRING.valid(
    ...ADMISSIONS_STATUS_OPTIONS,
  )
    .required()
    .description('The Tax Court bar admission status for the practitioner.'),
  alternateEmail: JoiValidationConstants.EMAIL.optional()
    .allow(null)
    .description('An alternate email address for the practitioner.'),
  barNumber: JoiValidationConstants.STRING.max(100)
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
  employer: JoiValidationConstants.STRING.valid(...EMPLOYER_OPTIONS)
    .required()
    .description('The employer designation for the practitioner.'),
  entityName: JoiValidationConstants.STRING.valid('Practitioner').required(),
  firmName: JoiValidationConstants.STRING.max(100)
    .optional()
    .allow(null)
    .description('The firm name for the practitioner.'),
  firstName: JoiValidationConstants.STRING.max(100)
    .required()
    .description('The first name of the practitioner.'),
  lastName: JoiValidationConstants.STRING.max(100)
    .required()
    .description('The last name of the practitioner.'),
  middleName: JoiValidationConstants.STRING.max(100)
    .optional()
    .allow(null)
    .description('The optional middle name of the practitioner.'),
  originalBarState: JoiValidationConstants.STRING.max(100)
    .required()
    .description(
      'The state in which the practitioner passed their bar examination.',
    ),
  practitionerType: JoiValidationConstants.STRING.valid(
    ...PRACTITIONER_TYPE_OPTIONS,
  )
    .required()
    .description('The type of practitioner - either Attorney or Non-Attorney.'),
  role: joi.alternatives().conditional('admissionsStatus', {
    is: joi.valid('Active'),
    otherwise: JoiValidationConstants.STRING.valid(
      ROLES.inactivePractitioner,
    ).required(),
    then: JoiValidationConstants.STRING.valid(
      ...[ROLES.irsPractitioner, ROLES.privatePractitioner],
    ).required(),
  }),
  suffix: JoiValidationConstants.STRING.max(100)
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

Practitioner.validationRules = practitionerValidation;

Practitioner.VALIDATION_ERROR_MESSAGES = VALIDATION_ERROR_MESSAGES;

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
  Practitioner: validEntityDecorator(Practitioner),
  entityName,
};
