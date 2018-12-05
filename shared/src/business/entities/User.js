/**
 * constructor
 * @param user
 * @constructor
 */
function User(user) {
  Object.assign(this, user);

  //petitioner
  if (this.userId === 'taxpayer') {
    if (!this.firstName) {
      this.firstName = 'Test';
    }
    if (!this.lastName) {
      this.lastName = 'Taxpayer';
    }
    if (!this.role) {
      this.role = 'taxpayer';
    }
    if (!this.token) {
      this.token = 'taxpayer';
    }
  }
  //petitionsclerk
  else if (this.userId === 'petitionsclerk') {
    if (!this.firstName) {
      this.firstName = 'Test';
    }
    if (!this.lastName) {
      this.lastName = 'Petitionsclerk';
    }
    if (!this.role) {
      this.role = 'petitionsclerk';
    }
    if (!this.token) {
      this.token = 'petitionsclerk';
    }
  }

  else if (this.userId === 'intakeclerk') {
    if (!this.firstName) {
      this.firstName = 'Test';
    }
    if (!this.lastName) {
      this.lastName = 'Intakeclerk';
    }
    if (!this.role) {
      this.role = 'intakeclerk';
    }
    if (!this.token) {
      this.token = 'intakeclerk';
    }
    if (!this.userId) {
      this.userId = 'intakeclerk';
    }
  }

  else if (this.userId === 'irsattorney') {
    if (!this.firstName) {
      this.firstName = 'IRS';
    }
    if (!this.lastName) {
      this.lastName = 'Attorney';
    }
    if (!this.role) {
      this.role = 'irsattorney';
    }
    if (!this.barNumber) {
      this.barNumber = '12345';
    }
    if (!this.token) {
      this.token = 'irsattorney';
    }
    if (!this.userId) {
      this.userId = 'irsattorney';
    }
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
