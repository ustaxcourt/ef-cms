const { PublicUser, VALIDATION_ERROR_MESSAGES } = require('./PublicUser');

describe('PublicUser entity', () => {
  describe('validation', () => {
    it('fails validation when role is not provided', () => {
      const publicUser = new PublicUser({});

      expect(publicUser.getFormattedValidationErrors()).toMatchObject({
        role: VALIDATION_ERROR_MESSAGES.role,
      });
    });
  });
});
