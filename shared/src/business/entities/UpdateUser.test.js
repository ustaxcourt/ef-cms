const { ROLES } = require('./EntityConstants');
const { UpdateUser } = require('./UpdateUser');

describe('UpdateUser entity', () => {
  it('is invalid when an email is not provided', () => {
    const user = new UpdateUser({
      email: 'ss',
      name: 'Someone',
      role: ROLES.privatePractitioner,
      userId: 'd33d249f-6596-4110-9dc5-6d64201b7e38',
    });
    expect(user.getFormattedValidationErrors()).toEqual({
      email: UpdateUser.VALIDATION_ERROR_MESSAGES.email,
    });
  });

  it('is valid when a valid email is provided', () => {
    const user = new UpdateUser({
      email: 'someone@example.com',
      name: 'Someone',
      role: ROLES.privatePractitioner,
      userId: 'd33d249f-6596-4110-9dc5-6d64201b7e38',
    });
    expect(user.getFormattedValidationErrors()).toBe(null);
  });
});
