import { applicationContext } from '../../applicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { validateEmailFormHelper as validateEmailFormComputed } from './validateEmailFormHelper';
import { withAppContextDecorator } from '@web-client/withAppContext';

const validateEmailFormHelper = withAppContextDecorator(
  validateEmailFormComputed,
  applicationContext,
);

describe('validateEmailFormHelper', () => {
  it('should not return any error messages when two valid email addresses are provided', () => {
    const result = runCompute(validateEmailFormHelper, {
      state: {
        form: {
          confirmEmail: 'hi@example.com',
          email: 'hi@example.com',
        },
      },
    });

    expect(result.confirmEmailErrorMessage).toBeUndefined();
    expect(result.emailErrorMessage).toBeUndefined();
  });

  it('should return an error message if an invalid email address is provided', () => {
    const result = runCompute(validateEmailFormHelper, {
      state: {
        form: {
          confirmEmail: 'hi@example',
          email: 'hi@example.com',
        },
      },
    });

    expect(result.confirmEmailErrorMessage).toBe(
      'Enter email address in format: yourname@example.com',
    );
    expect(result.emailErrorMessage).toBeUndefined();
  });

  it('should return an error message if an invalid email address is provided', () => {
    const result = runCompute(validateEmailFormHelper, {
      state: {
        form: {
          confirmEmail: undefined,
          email: 'hi@example.com',
        },
      },
    });

    expect(result.confirmEmailErrorMessage).toBe('Enter a valid email address');
    expect(result.emailErrorMessage).toBeUndefined();
  });
});
