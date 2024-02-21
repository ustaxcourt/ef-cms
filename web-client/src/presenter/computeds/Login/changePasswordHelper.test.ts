import { changePasswordHelper } from '@web-client/presenter/computeds/Login/changePasswordHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('changePasswordHelper', () => {
  it('should return validation values as true when form is valid', () => {
    const result = runCompute(changePasswordHelper, {
      state: {
        authentication: {
          form: {
            confirmPassword: 'aA1!aaaa',
            email: 'test@example.com',
            password: 'aA1!aaaa',
          },
        },
      },
    });

    expect(result).toEqual(
      expect.objectContaining({
        confirmPassword: true,
        formIsValid: true,
        passwordErrors: [
          {
            message: 'Must not contain leading or trailing space',
            valid: true,
          },
          { message: 'Must contain lower case letter', valid: true },
          { message: 'Must contain number', valid: true },
          { message: 'Must contain upper case letter', valid: true },
          { message: 'Must contain special character or space', valid: true },
          { message: 'Must be between 8-99 characters long', valid: true },
        ],
      }),
    );
  });

  it('should return false when confirmPassword is not valid', () => {
    const result = runCompute(changePasswordHelper, {
      state: {
        authentication: {
          form: {
            confirmPassword: 'aA1!a',
            email: 'test@example.com',
            password: 'aA1!aaaa',
          },
        },
      },
    });

    expect(result.confirmPassword).toEqual(false);
    expect(result.formIsValid).toEqual(false);
  });

  describe('passwordErrors', () => {
    it('should return all true values when password is empty', () => {
      const { passwordErrors } = runCompute(changePasswordHelper, {
        state: {
          authentication: {
            form: {
              email: 'realEmail@example.com',
              password: '',
            },
          },
        },
      });

      expect(passwordErrors).toEqual([
        {
          message: 'Must not contain leading or trailing space',
          valid: true,
        },
        { message: 'Must contain lower case letter', valid: true },
        { message: 'Must contain number', valid: true },
        { message: 'Must contain upper case letter', valid: true },
        { message: 'Must contain special character or space', valid: true },
        { message: 'Must be between 8-99 characters long', valid: true },
      ]);
    });

    it('should validate a password with a leading space', () => {
      const { passwordErrors } = runCompute(changePasswordHelper, {
        state: {
          authentication: {
            form: {
              email: 'realEmail@example.com',
              password: ' Testing1234$',
            },
          },
        },
      });

      expect(passwordErrors).toEqual([
        {
          message: 'Must not contain leading or trailing space',
          valid: false,
        },
        { message: 'Must contain lower case letter', valid: true },
        { message: 'Must contain number', valid: true },
        { message: 'Must contain upper case letter', valid: true },
        { message: 'Must contain special character or space', valid: true },
        { message: 'Must be between 8-99 characters long', valid: true },
      ]);
    });

    it('should validate a password with no letters', () => {
      const { passwordErrors } = runCompute(changePasswordHelper, {
        state: {
          authentication: {
            form: {
              email: 'realEmail@example.com',
              password: '56781234$',
            },
          },
        },
      });

      expect(passwordErrors).toEqual([
        {
          message: 'Must not contain leading or trailing space',
          valid: true,
        },
        { message: 'Must contain lower case letter', valid: false },
        { message: 'Must contain number', valid: true },
        { message: 'Must contain upper case letter', valid: false },
        { message: 'Must contain special character or space', valid: true },
        { message: 'Must be between 8-99 characters long', valid: true },
      ]);
    });

    it('should validate a password with no numbers or special characters', () => {
      const { passwordErrors } = runCompute(changePasswordHelper, {
        state: {
          authentication: {
            form: {
              email: 'realEmail@example.com',
              password: 'goodPassword',
            },
          },
        },
      });

      expect(passwordErrors).toEqual([
        {
          message: 'Must not contain leading or trailing space',
          valid: true,
        },
        { message: 'Must contain lower case letter', valid: true },
        { message: 'Must contain number', valid: false },
        { message: 'Must contain upper case letter', valid: true },
        { message: 'Must contain special character or space', valid: false },
        { message: 'Must be between 8-99 characters long', valid: true },
      ]);
    });

    it('should validate a password that is fewer than 8 characters long', () => {
      const { passwordErrors } = runCompute(changePasswordHelper, {
        state: {
          authentication: {
            form: {
              email: 'realEmail@example.com',
              password: 'aB1$',
            },
          },
        },
      });

      expect(passwordErrors).toEqual([
        {
          message: 'Must not contain leading or trailing space',
          valid: true,
        },
        { message: 'Must contain lower case letter', valid: true },
        { message: 'Must contain number', valid: true },
        { message: 'Must contain upper case letter', valid: true },
        { message: 'Must contain special character or space', valid: true },
        { message: 'Must be between 8-99 characters long', valid: false },
      ]);
    });

    it('should validate a password that is longer than 99 characters', () => {
      const { passwordErrors } = runCompute(changePasswordHelper, {
        state: {
          authentication: {
            form: {
              email: 'realEmail@example.com',
              password:
                'KyA!1Quqagfkp4welhhf5su93V7AS80OMaSlzFkcQKHg571h5xOJu5Rk9E89ZRY1Y8XKvVnUI2QG50muWpF7Y8GB16cKkMCvh62Xl5CIEnk5yoJZ2SOKI0jTEYXstZtkTfbXNLb1LYrfU5ENUcJC31NA3q0',
            },
          },
        },
      });

      expect(passwordErrors).toEqual([
        {
          message: 'Must not contain leading or trailing space',
          valid: true,
        },
        { message: 'Must contain lower case letter', valid: true },
        { message: 'Must contain number', valid: true },
        { message: 'Must contain upper case letter', valid: true },
        { message: 'Must contain special character or space', valid: true },
        { message: 'Must be between 8-99 characters long', valid: false },
      ]);
    });

    it('should return showForgotPasswordCode as true when tempPassword is not present', () => {
      const result = runCompute(changePasswordHelper, {
        state: {
          authentication: {
            code: 'abc123',
            form: {
              confirmPassword: 'aA1!aaaa',
              email: 'test@example.com',
              password: 'aA1!aaaa',
            },
            tempPassword: '',
          },
        },
      });

      expect(result.showForgotPasswordCode).toEqual(true);
    });

    it('should return showForgotPasswordCode as false when tempPassword is present', () => {
      const result = runCompute(changePasswordHelper, {
        state: {
          authentication: {
            code: '',
            form: {
              confirmPassword: 'aA1!aaaa',
              email: 'test@example.com',
              password: 'aA1!aaaa',
            },
            tempPassword: 'abc123',
          },
        },
      });

      expect(result.showForgotPasswordCode).toEqual(false);
    });
  });
});
