const assert = require('assert');

const User = require('./User');

describe('User entity', () => {
  it('Assigns the expected petitions section to the user', () => {
    const user = new User({
      userId: 'petitionsclerk',
    });
    expect(user.section).toEqual('petitions');
  });

  it('Assigns the expected docket section to the user', () => {
    const user = new User({
      userId: 'docketclerk',
    });
    expect(user.section).toEqual('docket');
  });

  it('Assigns the expected seniorattorney section to the user', () => {
    const user = new User({
      userId: 'seniorattorney',
    });
    expect(user.section).toEqual('seniorattorney');
  });

  it('Creates a valid taxpayer user', () => {
    const user = new User({
      userId: 'taxpayer', role: 'petitioner',
      role: 'Tester',
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
    });
    assert.ok(user.isValid());
  });

  it('Creates a valid respondent user', () => {
    const user = new User({
      userId: 'intakeclerk',
      role: 'Tester',
      firstName: 'firstName',
      lastName: 'lastName',
    });
    assert.ok(user.isValid());
  });
});
