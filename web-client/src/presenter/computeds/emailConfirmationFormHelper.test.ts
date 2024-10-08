import { applicationContext } from '../../applicationContext';
import { emailConfirmationFormHelper as emailConfirmationFormComputed } from './emailConfirmationFormHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '@web-client/withAppContext';

const emailConfirmationFormHelper = withAppContextDecorator(
  emailConfirmationFormComputed,
  applicationContext,
);

const baseInitialState = {
  emailConfirmation: {
    confirmEmailErrorMessage: undefined,
    emailErrorMessage: undefined,
    inFocusConfirmEmail: false,
    inFocusEmail: false,
    isDirtyConfirmEmail: false,
    isDirtyEmail: false,
  },
  form: {
    confirmEmail: undefined,
    email: undefined,
  },
};

describe('emailConfirmationFormHelper', () => {
  it('should display email validation errors when the email field contains invalid data, the field is unfocused, and the form has not yet been submitted', () => {
    const result = runCompute(emailConfirmationFormHelper, {
      state: {
        ...baseInitialState,
        emailConfirmation: {
          ...baseInitialState.emailConfirmation,
          emailErrorMessage: 'Enter a valid email address',
          inFocusEmail: false,
          isDirtyEmail: true,
        },
      },
    });

    expect(result.emailErrorMessage).toBe('Enter a valid email address');
    expect(result.showEmailErrorMessage).toBe(true);
  });

  it('should display confirm email validation errors when the confirm email field contains invalid data, the field is unfocused, and the form has not yet been submitted', () => {
    const result = runCompute(emailConfirmationFormHelper, {
      state: {
        ...baseInitialState,
        emailConfirmation: {
          ...baseInitialState.emailConfirmation,
          confirmEmailErrorMessage: 'Enter a valid email address',
          inFocusConfirmEmail: false,
          isDirtyConfirmEmail: true,
        },
      },
    });

    expect(result.confirmEmailErrorMessage).toBe('Enter a valid email address');
    expect(result.showConfirmEmailErrorMessage).toBe(true);
  });

  it('should display both errro messages if the form was submitted', () => {
    const result = runCompute(emailConfirmationFormHelper, {
      state: {
        ...baseInitialState,
        emailConfirmation: {
          confirmEmailErrorMessage: 'Enter a valid email address',
          emailErrorMessage: 'Enter a valid email address',
          inFocusConfirmEmail: false,
          inFocusEmail: false,
          isDirtyConfirmEmail: true,
          isDirtyEmail: true,
        },
      },
    });

    expect(result.confirmEmailErrorMessage).toBe('Enter a valid email address');
    expect(result.emailErrorMessage).toBe('Enter a valid email address');
    expect(result.showConfirmEmailErrorMessage).toBe(true);
    expect(result.showEmailErrorMessage).toBe(true);
  });
});
