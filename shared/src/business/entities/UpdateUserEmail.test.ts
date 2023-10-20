import { UpdateUserEmail } from './UpdateUserEmail';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';

describe('UpdateUserEmail', () => {
  describe('validation', () => {
    it('should fail validation when email is not provided', () => {
      const updateUserEmailEntity = new UpdateUserEmail({
        confirmEmail: 'test@example.com',
        email: undefined,
      });
      const customMessages = extractCustomMessages(
        updateUserEmailEntity.getValidationRules(),
      );

      expect(updateUserEmailEntity.isValid()).toBeFalsy();
      expect(updateUserEmailEntity.getFormattedValidationErrors()).toEqual({
        confirmEmail: customMessages.confirmEmail[0],
        email: customMessages.email[0],
      });
    });

    it('should fail validation when confirmEmail is not provided', () => {
      const updateUserEmailEntity = new UpdateUserEmail({
        confirmEmail: undefined,
        email: 'test@example.com',
      });
      const customMessages = extractCustomMessages(
        updateUserEmailEntity.getValidationRules(),
      );
      expect(updateUserEmailEntity.isValid()).toBeFalsy();
      expect(updateUserEmailEntity.getFormattedValidationErrors()).toEqual({
        confirmEmail: customMessages.confirmEmail[1],
      });
    });

    it('should fail validation when confirmEmail does not match email', () => {
      const updateUserEmailEntity = new UpdateUserEmail({
        confirmEmail: 'test2@example.com',
        email: 'test@example.com',
      });
      const customMessages = extractCustomMessages(
        updateUserEmailEntity.getValidationRules(),
      );
      expect(updateUserEmailEntity.isValid()).toBeFalsy();
      expect(updateUserEmailEntity.getFormattedValidationErrors()).toEqual({
        confirmEmail: customMessages.confirmEmail[0],
      });
    });

    it('should fail validation when email and confirmEmail are not provided', () => {
      const updateUserEmailEntity = new UpdateUserEmail({
        confirmEmail: undefined,
        email: undefined,
      });
      const customMessages = extractCustomMessages(
        updateUserEmailEntity.getValidationRules(),
      );
      expect(updateUserEmailEntity.isValid()).toBeFalsy();
      expect(updateUserEmailEntity.getFormattedValidationErrors()).toEqual({
        confirmEmail: customMessages.confirmEmail[1],
        email: customMessages.email[0],
      });
    });

    it('should fail validation when email is NOT a valid email address and confirmEmail is valid', () => {
      const updateUserEmailEntity = new UpdateUserEmail({
        confirmEmail: 'test@example.com',
        email: 'testexample.com',
      });
      const customMessages = extractCustomMessages(
        updateUserEmailEntity.getValidationRules(),
      );
      expect(updateUserEmailEntity.isValid()).toBeFalsy();
      expect(updateUserEmailEntity.getFormattedValidationErrors()).toEqual({
        confirmEmail: customMessages.confirmEmail[0],
        email: customMessages.email[0],
      });
    });

    it('should fail validation when confirmEmail is NOT a valid email address and email is valid', () => {
      const updateUserEmailEntity = new UpdateUserEmail({
        confirmEmail: 'testexample.com',
        email: 'test@example.com',
      });
      const customMessages = extractCustomMessages(
        updateUserEmailEntity.getValidationRules(),
      );
      expect(updateUserEmailEntity.isValid()).toBeFalsy();
      expect(updateUserEmailEntity.getFormattedValidationErrors()).toEqual({
        confirmEmail: customMessages.confirmEmail[2],
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
