const { getSectionForRole } = require('./WorkQueue');

const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

joiValidationDecorator(
  User,
  joi.object().keys({
    userId: joi.string().required(),
    token: joi.string().optional(),
  }),
);
/**
 * constructor
 * @param user
 * @constructor
 */
function User(user) {
  if (typeof user === 'string') {
    user = { userId: user, role: 'petitioner' };
  }
  Object.assign(this, user);

  if (process.env.ENV === 'Local') {
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
    } else if (role.indexOf('petitioner') > -1) {
      role = 'petitioner';
    } else if (/petitionsclerk(\d{1,2})?$/.test(role)) {
      role = 'petitionsclerk';
    } else if (role.indexOf('respondent') > -1) {
      role = 'respondent';
    } else if (role.indexOf('seniorattorney') > -1) {
      role = 'seniorattorney';
    } else if (role.indexOf('intakeclerk') > -1) {
      role = 'intakeclerk';
    } else if (role.indexOf('taxpayer') > -1) {
      role = 'petitioner';
    }

    if (validRoles.includes(role)) {
      const name =
        'Test ' +
        this.userId.replace(/^\w/, c => c.toUpperCase()).replace(/@.*/, '');
      const barNumber =
        this.userId === 'respondent' || this.userId === 'seniorattorney'
          ? '12345'
          : undefined;
      Object.assign(this, {
        name,
        role: role,
        barNumber,
        email: `test${this.userId}@example.com`,
        addressLine1: '111 Orange St.',
        addressLine2: 'Building 2',
        city: 'Orlando',
        state: 'FL',
        zip: '37208',
        phone: '111-111-1111',
      });
    }
  }
  this.section = getSectionForRole(this.role);
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
