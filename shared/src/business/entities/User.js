/**
 * constructor
 * @param user
 * @constructor
 */
function User(user) {
  if (!user.userId) {
    this.userId = 'taxpayer'; //TODO throw error?
  } else {
    Object.assign(this, user);
  }
  //petitioner
  if (this.userId === 'taxpayer') {
    if (!this.firstName) {
      this.firstName = 'Test';
    }
    if (!this.lastName) {
      this.lastName = 'Taxpayer';
    }
    if (!this.role) {
      this.role = 'petitioner';
    }
    if (!this.token) {
      this.token = 'taxpayer';
    }
  }
  //petitionsclerk
  if (this.userId === 'petitionsclerk') {
    if (!this.firstName) {
      this.firstName = 'Test';
    }
    if (!this.lastName) {
      this.lastName = 'Petitionsclerk';
    }
    if (!this.role) {
      this.role = 'internal';
    }
    if (!this.token) {
      this.token = 'petitionsclerk';
    }
  }

  if (this.userId === 'intakeclerk') {
    if (!this.firstName) {
      this.firstName = 'Test';
    }
    if (!this.lastName) {
      this.lastName = 'Intakeclerk';
    }
    if (!this.role) {
      this.role = 'internal';
    }
    if (!this.token) {
      this.token = 'intakeclerk';
    }
    if (!this.userId) {
      this.userId = 'intakeclerk';
    }
  }

  if (this.userId === 'irsattorney') {
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
