import { PASSWORD_VALIDATION_ERROR_MESSAGES } from '@shared/business/entities/EntityValidationConstants';
import { createAccountHelper } from '@web-client/presenter/computeds/CreatePetitionerAccount/createAccountHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('createAccountHelper', () => {
  describe('passwordErrors', () => {
    it('should return object with valid flags when "password" passes validations', () => {
      const result = runCompute(createAccountHelper, {
        state: {
          form: {
            password: 'aA1!aaaa',
          },
        },
      });

      for (const error in result.passwordErrors) {
        expect(result.passwordErrors[error].valid).toBeTruthy();
      }
    });

    it('should return object with invalid length flag when "password" is not long enough', () => {
      const result = runCompute(createAccountHelper, {
        state: {
          form: {
            password: 'aA1!aaa',
          },
        },
      });

      expect(
        result.passwordErrors.find(error => {
          return (
            error.message === PASSWORD_VALIDATION_ERROR_MESSAGES.isProperLength
          );
        })?.valid,
      ).toEqual(false);
    });

    it('should return object with invalid flags for all password validation fields', () => {
      const result = runCompute(createAccountHelper, {
        state: {
          form: {
            password: ' ',
          },
        },
      });

      result.passwordErrors.forEach(error => {
        expect(error.valid).toEqual(false);
      });
    });
  });

  describe('confirmPassword', () => {
    it('should return "true" if "confirmPassword" passes validation', () => {
      const result = runCompute(createAccountHelper, {
        state: {
          form: {
            confirmPassword: 'aA1!aaaa',
            password: 'aA1!aaaa',
          },
        },
      });

      expect(result).toMatchObject({
        confirmPassword: true,
      });
    });

    it('should return "false" if "confirmPassword" fails validation', () => {
      const result = runCompute(createAccountHelper, {
        state: {
          form: {
            confirmPassword: 'aA1!aaaa',
            password: 'aA1!aaaa_MORE',
          },
        },
      });

      expect(result).toMatchObject({
        confirmPassword: false,
      });
    });
  });

  describe('email', () => {
    it('should return the error message when "email" fails validation', () => {
      const result = runCompute(createAccountHelper, {
        state: {
          form: {
            email: 'NOT A REAL EMAIL',
          },
        },
      });

      expect(result).toMatchObject({
        email: 'Enter a valid email address',
      });
    });
  });

  describe('name', () => {
    it('should return the error message when "name" fails validation', () => {
      const result = runCompute(createAccountHelper, {
        state: {
          form: {
            name: 'a'.repeat(101),
          },
        },
      });

      expect(result).toMatchObject({
        name: 'Enter a name with fewer than 100 characters',
      });
    });
  });

  describe('formIsValid', () => {
    it('should return "true" when the form is all valid', () => {
      const result = runCompute(createAccountHelper, {
        state: {
          form: {
            confirmPassword: 'aA1!aaaa',
            email: 'example@example.com',
            name: 'John Cena',
            password: 'aA1!aaaa',
          },
        },
      });

      expect(result).toMatchObject({
        formIsValid: true,
      });
    });

    it('should return "false" when the something failed the form validation', () => {
      const result = runCompute(createAccountHelper, {
        state: {
          form: {
            confirmPassword: 'aA1!aaaa_NOT_MATCHING',
            email: 'example@example.com',
            name: 'John Cena',
            password: 'aA1!aaaa',
          },
        },
      });

      expect(result).toMatchObject({
        formIsValid: false,
      });
    });
  });
});
