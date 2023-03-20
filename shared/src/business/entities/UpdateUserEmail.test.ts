const { UpdateUserEmail } = require('./UpdateUserEmail');

describe('UpdateUserEmail', () => {
  describe('validation', () => {
    it('should fail validation when email is not provided', () => {
      const updateUserEmailEntity = new UpdateUserEmail({
        confirmEmail: 'test@example.com',
        email: undefined,
      });

      expect(updateUserEmailEntity.isValid()).toBeFalsy();
      expect(updateUserEmailEntity.getFormattedValidationErrors()).toEqual({
        confirmEmail:
          UpdateUserEmail.VALIDATION_ERROR_MESSAGES.confirmEmail[0].message,
        email: UpdateUserEmail.VALIDATION_ERROR_MESSAGES.email,
      });
    });

    it('should fail validation when confirmEmail is not provided', () => {
      const updateUserEmailEntity = new UpdateUserEmail({
        confirmEmail: undefined,
        email: 'test@example.com',
      });

      expect(updateUserEmailEntity.isValid()).toBeFalsy();
      expect(updateUserEmailEntity.getFormattedValidationErrors()).toEqual({
        confirmEmail:
          UpdateUserEmail.VALIDATION_ERROR_MESSAGES.confirmEmail[1].message,
      });
    });

    it('should fail validation when confirmEmail does not match email', () => {
      const updateUserEmailEntity = new UpdateUserEmail({
        confirmEmail: 'test2@example.com',
        email: 'test@example.com',
      });

      expect(updateUserEmailEntity.isValid()).toBeFalsy();
      expect(updateUserEmailEntity.getFormattedValidationErrors()).toEqual({
        confirmEmail:
          UpdateUserEmail.VALIDATION_ERROR_MESSAGES.confirmEmail[0].message,
      });
    });

    it('should fail validation when email and confirmEmail are not provided', () => {
      const updateUserEmailEntity = new UpdateUserEmail({
        confirmEmail: undefined,
        email: undefined,
      });

      expect(updateUserEmailEntity.isValid()).toBeFalsy();
      expect(updateUserEmailEntity.getFormattedValidationErrors()).toEqual({
        confirmEmail:
          UpdateUserEmail.VALIDATION_ERROR_MESSAGES.confirmEmail[1].message,
        email: UpdateUserEmail.VALIDATION_ERROR_MESSAGES.email,
      });
    });

    it('should fail validation when email is NOT a valid email address and confirmEmail is valid', () => {
      const updateUserEmailEntity = new UpdateUserEmail({
        confirmEmail: 'test@example.com',
        email: 'testexample.com',
      });

      expect(updateUserEmailEntity.isValid()).toBeFalsy();
      expect(updateUserEmailEntity.getFormattedValidationErrors()).toEqual({
        confirmEmail:
          UpdateUserEmail.VALIDATION_ERROR_MESSAGES.confirmEmail[0].message,
        email: UpdateUserEmail.VALIDATION_ERROR_MESSAGES.email,
      });
    });

    it('should fail validation when confirmEmail is NOT a valid email address and email is valid', () => {
      const updateUserEmailEntity = new UpdateUserEmail({
        confirmEmail: 'testexample.com',
        email: 'test@example.com',
      });

      expect(updateUserEmailEntity.isValid()).toBeFalsy();
      expect(updateUserEmailEntity.getFormattedValidationErrors()).toEqual({
        confirmEmail:
          UpdateUserEmail.VALIDATION_ERROR_MESSAGES.confirmEmail[2].message,
      });
    });

    it('should pass validation when email and confirmEmail are provided and match', () => {
      const updateUserEmailEntity = new UpdateUserEmail({
        confirmEmail: 'test@example.com',
        email: 'test@example.com',
      });

      expect(updateUserEmailEntity.isValid()).toBeTruthy();
    });
  });
});
