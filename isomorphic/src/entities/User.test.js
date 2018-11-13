const assert = require('assert');

const User = require('./User');

describe('Petition entity', () => {
  it('Creates a valid petition', () => {
    const user = new User({
      name: 'Bob',
    });
    assert.ok(user.isValid());
  });
  it('Creates an invalid petition', () => {
    const user = new User({
      name: '',
    });
    assert.ok(!user.isValid());
  });
});
