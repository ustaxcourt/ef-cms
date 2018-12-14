/**
 * constructor
 * @param user
 * @constructor
 */
function User(user) {
  Object.assign(this, user);

  const validRoles = [
    'taxpayer',
    'petitionsclerk',
    'intakeclerk',
    'respondent',
    'docketclerk',
    'seniorattorney',
  ];

  if (validRoles.includes(this.userId)) {
    Object.assign(this, {
      name: `Test ${this.userId.toUpperCase()}`,
      role: this.userId,
      token: this.userId,
      email: `test${this.userId}@example.com`,
      addressLine1: '111 Orange St.',
      addressLine2: 'Building 2',
      city: 'Orlando',
      state: 'FL',
      zip: '37208',
      phone: '111-111-1111',
    });
  } else {
    throw new Error('invalid user');
  }
}

/**
 * isValid
 * @returns {boolean}
 */
User.prototype.isValid = function isValid() {
  return !!this.userId && !!this.role;
};

module.exports = User;
