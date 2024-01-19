import { NewPetitionerUser } from '@shared/business/entities/NewPetitionerUser';
import { PASSWORD_VALIDATION_ERROR_MESSAGES } from './EntityValidationConstants';

describe('NewPetitionerUser', () => {
  const validEntity = {
    confirmPassword: '12$Azasodfkj3',
    email: 'test@example.com',
    name: 'bob',
    password: '12$Azasodfkj3',
  };

  it('should return a valid NewPetitionerUser entity', () => {
    const formEntity = new NewPetitionerUser(validEntity);
    expect(formEntity.isValid()).toBeTruthy();
    expect(formEntity.getValidationErrors()).toBeNull();
  });

  describe('Email', () => {
    it('should return error message for email', () => {
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        email: 'hello',
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getValidationErrors()).toEqual({
        email: 'Enter a valid email address',
      });
    });
  });

  describe('Name', () => {
    it('should return error message for name when not provided', () => {
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        name: '',
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getValidationErrors()).toEqual({
        name: 'Enter a name',
      });
    });

    it('should return error message for name when exceeds length', () => {
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        name: '#'.repeat(101),
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getValidationErrors()).toEqual({
        name: 'Enter a name with fewer than 100 characters',
      });
    });
  });

  describe('password', () => {
    it('should include "hasNoLeadingOrTrailingSpace" in the error message when provided a password with leading space', () => {
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        confirmPassword: ' 12$Azasodfkj3',
        password: ' 12$Azasodfkj3',
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getValidationErrors()).toEqual({
        password: 'hasNoLeadingOrTrailingSpace',
      });
    });

    it('should include "hasNoLeadingOrTrailingSpace" in the error message when provided a password with trailing space', () => {
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        confirmPassword: '12$Azasodfkj3 ',
        password: '12$Azasodfkj3 ',
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getValidationErrors()).toEqual({
        password: 'hasNoLeadingOrTrailingSpace',
      });
    });

    it('should return error message provided a password that does not contain a lower case character', () => {
      const PASSWORD = '1AWD%$DNAWK';
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        confirmPassword: PASSWORD,
        password: PASSWORD,
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getValidationErrors()).toEqual({
        password: PASSWORD_VALIDATION_ERROR_MESSAGES.hasOneLowercase,
      });
    });

    it('should return error message provided a password that does not contain a number', () => {
      const PASSWORD = 'aAWD%$DNAWK';
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        confirmPassword: PASSWORD,
        password: PASSWORD,
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getValidationErrors()).toEqual({
        password: PASSWORD_VALIDATION_ERROR_MESSAGES.hasOneNumber,
      });
    });

    it('should return error message provided a password that does not contain an upper case character', () => {
      const PASSWORD = 'aaws%$dn1awk';
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        confirmPassword: PASSWORD,
        password: PASSWORD,
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getValidationErrors()).toEqual({
        password: PASSWORD_VALIDATION_ERROR_MESSAGES.hasOneUppercase,
      });
    });

    it('should return error message provided a password that does not contain a special character', () => {
      const PASSWORD = 'aaWsdn1awk';
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        confirmPassword: PASSWORD,
        password: PASSWORD,
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getValidationErrors()).toEqual({
        password: PASSWORD_VALIDATION_ERROR_MESSAGES.hasSpecialCharacterOrSpace,
      });
    });

    it('should return error message provided a password that is fewer than 8 characters long', () => {
      const PASSWORD = '1$Ab';
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        confirmPassword: PASSWORD,
        password: PASSWORD,
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getValidationErrors()).toMatchObject({
        password: PASSWORD_VALIDATION_ERROR_MESSAGES.isProperLength,
      });
    });

    it('should return error message provided a password that is greater than 99 characters long', () => {
      const PASSWORD = '12$Azasodfkj3'.repeat(13);
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        confirmPassword: PASSWORD,
        password: PASSWORD,
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getValidationErrors()).toMatchObject({
        password: PASSWORD_VALIDATION_ERROR_MESSAGES.isProperLength,
      });
    });
  });

  describe('confirmPassword', () => {
    it('should return error message when confirmPassword does not match password', () => {
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        confirmPassword: 'somethingDifferent',
        password: '12$Azasodfkj3',
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getValidationErrors()).toEqual({
        confirmPassword: 'Passwords must match',
      });
    });

    it('should not return an error message when confirmPassword matches password', () => {
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        confirmPassword: '12$Azasodfkj3',
        password: '12$Azasodfkj3',
      });
      expect(formEntity.isValid()).toBe(true);
      expect(formEntity.getValidationErrors()).toEqual(null);
    });
  });
});
