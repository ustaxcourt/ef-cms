const { UnknownUserError } = require('../../errors/errors');

const { getSectionForRole } = require('./WorkQueue');

const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

joiValidationDecorator(
  User,
  joi.object().keys({
    userId: joi.string().required(),
  }),
);
/**
 * constructor
 * @param user
 * @constructor
 */
function User(user) {
  Object.assign(this, user);

  const validRoles = [
    'petitioner',
    'petitionsclerk',
    'intakeclerk',
    'respondent',
    'docketclerk',
    'seniorattorney',
  ];

  let role = this.userId;
  if (/docketclerk(\d{1,2})?$/.test(role)) {
    role = 'docketclerk';
  }
  if (role.indexOf('petitioner') > -1) {
    role = 'petitioner';
  }
  if (/petitionsclerk(\d{1,2})?$/.test(role)) {
    role = 'petitionsclerk';
  }
  if (role.indexOf('taxpayer') > -1) {
    role = 'petitioner';
  }

  if (validRoles.includes(role)) {
    const name = 'Test ' + this.userId.replace(/^\w/, c => c.toUpperCase());
    const barNumber =
      this.userId === 'respondent' || this.userId === 'seniorattorney'
        ? '12345'
        : undefined;
    Object.assign(this, {
      name,
      role: role,
      barNumber,
      token: this.userId,
      email: `test${this.userId}@example.com`,
      addressLine1: '111 Orange St.',
      addressLine2: 'Building 2',
      city: 'Orlando',
      state: 'FL',
      zip: '37208',
      phone: '111-111-1111',
    });
    this.section = getSectionForRole(role);
  } else {
    throw new UnknownUserError('Unknown user');
  }
}

/**
 * isValid
 * @returns {boolean}
 */
User.prototype.isValid = function isValid() {
  return !!this.userId && !!this.role;
};

User.prototype.getDocketRecordName = function getDocketRecordName() {
  return this.role === 'petitioner' ? `Petitioner ${this.name}` : this.name;
};

module.exports = User;
