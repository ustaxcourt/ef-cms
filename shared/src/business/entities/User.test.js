const assert = require('assert');

const User = require('./User');

describe('Petition entity', () => {
  it('Creates a valid petition', () => {
    const user = new User({
      userId: 'userId',
      role: 'Tester',
      firstName: 'firstName',
      lastName: 'lastName',
    });
    assert.ok(user.isValid());
  });
  it('Creates an invalid petition', () => {
    const user = new User({
      userId: '',
    });
    assert.ok(!user.isValid());
  });
});
