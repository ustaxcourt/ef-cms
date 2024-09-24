import { UpdateUserEmailForm } from './UpdateUserEmailForm';

describe('UpdateUserEmailForm', () => {
  describe('validation', () => {
    it('should fail validation when email is not provided', () => {
      const updateUserEmailFormEntity = new UpdateUserEmailForm({
        confirmEmail: 'test@example.com',
        email: undefined as any,
      });

      expect(updateUserEmailFormEntity.isValid()).toBeFalsy();
      expect(updateUserEmailFormEntity.getFormattedValidationErrors()).toEqual({
        confirmEmail: 'Email addresses do not match',
        email: 'Enter a valid email address',
      });
    });

    it('should fail validation when confirmEmail is not provided', () => {
      const updateUserEmailFormEntity = new UpdateUserEmailForm({
        confirmEmail: undefined as any,
        email: 'test@example.com',
      });

      expect(updateUserEmailFormEntity.isValid()).toBeFalsy();
      expect(updateUserEmailFormEntity.getFormattedValidationErrors()).toEqual({
        confirmEmail: 'Enter a valid email address',
      });
    });

    it('should fail validation when confirmEmail does not match email', () => {
      const updateUserEmailFormEntity = new UpdateUserEmailForm({
        confirmEmail: 'test2@example.com',
        email: 'test@example.com',
      });

      expect(updateUserEmailFormEntity.isValid()).toBeFalsy();
      expect(updateUserEmailFormEntity.getFormattedValidationErrors()).toEqual({
        confirmEmail: 'Email addresses do not match',
      });
    });

    it('should fail validation when email and confirmEmail are not provided', () => {
      const updateUserEmailFormEntity = new UpdateUserEmailForm({
        confirmEmail: undefined as any,
        email: undefined as any,
      });

      expect(updateUserEmailFormEntity.isValid()).toBeFalsy();
      expect(updateUserEmailFormEntity.getFormattedValidationErrors()).toEqual({
        confirmEmail: 'Enter a valid email address',
        email: 'Enter a valid email address',
      });
    });

    it('should fail validation when email is NOT a valid email address and confirmEmail is valid', () => {
      const updateUserEmailFormEntity = new UpdateUserEmailForm({
        confirmEmail: 'test@example.com',
        email: 'testexample.com',
      });

      expect(updateUserEmailFormEntity.isValid()).toBeFalsy();
      expect(updateUserEmailFormEntity.getFormattedValidationErrors()).toEqual({
        confirmEmail: 'Email addresses do not match',
        email: 'Enter email address in format: yourname@example.com',
      });
    });

    it('should fail validation when confirmEmail is NOT a valid email address and email is valid', () => {
      const updateUserEmailFormEntity = new UpdateUserEmailForm({
        confirmEmail: 'testexample.com',
        email: 'test@example.com',
      });

      expect(updateUserEmailFormEntity.isValid()).toBeFalsy();
      expect(updateUserEmailFormEntity.getFormattedValidationErrors()).toEqual({
        confirmEmail: 'Enter email address in format: yourname@example.com',
      });
    });

    it('should pass validation when email and confirmEmail are provided and match', () => {
      const updateUserEmailFormEntity = new UpdateUserEmailForm({
        confirmEmail: 'test@example.com',
        email: 'test@example.com',
      });

      expect(updateUserEmailFormEntity.isValid()).toBeTruthy();
    });
  });
});
