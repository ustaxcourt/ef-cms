const assert = require('assert');

const User = require('./User');

describe('User entity', () => {
  it('Creates a valid taxpayer user', () => {
    const user = new User({
      userId: 'taxpayer',
      role: 'Tester',
      firstName: 'firstName',
      lastName: 'lastName',
    });
    assert.ok(user.isValid());
  });

  it('Creates a valid petitionsclerk user', () => {
    const user = new User({
      userId: 'petitionsclerk',
      role: 'Tester',
      firstName: 'firstName',
      lastName: 'lastName',
    });
    assert.ok(user.isValid());
  });

  it('Creates a valid irsattorney user', () => {
    const user = new User({
      firstName: 'firstName',
      lastName: 'bob',
      role: 'Tester',
      barNumber: 'gg',
      token: 'abc',
      userId: 'irsattorney',
    });
    assert.ok(user.isValid());
  });

  it('Creates a valid irsattorney user', () => {
    const user = new User({
      userId: 'irsattorney',
    });
    assert.ok(user.isValid());
  });

  it('Creates a valid irsattorney user', () => {
    const user = new User({
      userId: 'intakeclerk',
      role: 'Tester',
      firstName: 'firstName',
      lastName: 'lastName',
    });
    assert.ok(user.isValid());
  });

  it('Creates an invalid user', () => {
    let error = null;
    try {
      new User({
        userId: '',
      });
    } catch (err) {
      error = err;
    }
    assert.ok(error);
  });
});
