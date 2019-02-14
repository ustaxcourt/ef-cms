const assert = require('assert');

const User = require('./User');

describe('User entity', () => {
  it('Creates a valid taxpayer user', () => {
    const user = new User({
      userId: 'taxpayer',
      role: 'petitioner',
      firstName: 'firstName',
      lastName: 'lastName',
    });
    assert.ok(user.isValid());
  });

  it('Creates a valid petitioner user', () => {
    const user = new User({
      userId: 'petitioner',
      role: 'Tester',
      firstName: 'firstName',
      lastName: 'lastName',
    });
    assert.ok(user.isValid());
  });

  it('Creates a valid respondent user', () => {
    const user = new User({
      firstName: 'firstName',
      lastName: 'bob',
      role: 'Tester',
      barNumber: 'gg',
      token: 'abc',
      userId: 'respondent',
    });
    assert.ok(user.isValid());
  });

  it('Creates a valid respondent user', () => {
    const user = new User({
      userId: 'respondent',
      role: 'respondent',
    });
    assert.ok(user.isValid());
  });

  it('Creates a valid intake clerk user', () => {
    const user = new User({
      userId: 'intakeclerk',
      role: 'intakeclerk',
      firstName: 'firstName',
      lastName: 'lastName',
    });
    assert.ok(user.isValid());
  });
});
