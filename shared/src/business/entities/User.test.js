const { User } = require('./User');

describe('User entity', () => {
  it('Creates a valid taxpayer user', () => {
    const user = new User({
      firstName: 'firstName',
      lastName: 'lastName',
      role: 'petitioner',
      userId: 'taxpayer',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates a valid petitioner user', () => {
    const user = new User({
      firstName: 'firstName',
      lastName: 'lastName',
      role: 'Tester',
      userId: 'petitioner',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates a valid respondent user', () => {
    const user = new User({
      barNumber: 'gg',
      firstName: 'firstName',
      lastName: 'bob',
      role: 'Tester',
      token: 'abc',
      userId: 'respondent',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates a valid respondent user', () => {
    const user = new User({
      role: 'respondent',
      userId: 'respondent',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates a user with default role of petitioner if not provided', () => {
    const user = new User({
      firstName: 'firstName',
      lastName: 'lastName',
      role: undefined,
      userId: 'bobbymcgee',
    });
    expect(user.role).toBe('petitioner');
  });
});
