/**
 * constructor
 * @param user
 * @constructor
 */
function User(user) {
  Object.assign(this, user);

  if (this.userId === 'taxpayer') {
    Object.assign(this, {
      name: 'Test Taxpayer',
      role: 'taxpayer',
      token: 'taxpayer',
      addressLine1: '111 Orange St.',
      addressLine2: 'Building 2',
      city: 'Orlando',
      state: 'FL',
      zip: '37208',
      phone: '111-111-1111',
      email: 'testtaxpayer@example.com',
    });
  } else if (this.userId === 'petitionsclerk') {
    Object.assign(this, {
      name: 'Test Petitionsclerk',
      role: 'petitionsclerk',
      token: 'petitionsclerk',
      addressLine1: '111 Orange St.',
      addressLine2: 'Building 2',
      city: 'Washington',
      state: 'DC',
      zip: '10111',
      phone: '111-111-1111',
      email: 'testpetitionsclerk@example.com',
    });
  } else if (this.userId === 'intakeclerk') {
    Object.assign(this, {
      name: 'Test Intakeclerk',
      role: 'intakeclerk',
      token: 'intakeclerk',
      addressLine1: '111 Orange St.',
      addressLine2: 'Building 2',
      city: 'Washington',
      state: 'DC',
      zip: '10111',
      phone: '111-111-1111',
      email: 'testintakeclerk@example.com',
    });
  } else if (this.userId === 'respondent') {
    Object.assign(this, {
      name: 'Test Respondent',
      role: 'respondent',
      token: 'respondent',
      addressLine1: '111 Orange St.',
      addressLine2: 'Building 2',
      city: 'Washington',
      state: 'DC',
      zip: '10111',
      phone: '111-111-1111',
      email: 'testrespondent@example.com',
      barNumber: '12345',
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
