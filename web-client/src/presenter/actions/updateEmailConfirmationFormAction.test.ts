import { runAction } from '@web-client/presenter/test.cerebral';
import { updateEmailConfirmationFormAction } from './updateEmailConfirmationFormAction';

const baseInitialState = {
  emailConfirmation: {
    confirmEmailErrorMessage: undefined,
    emailErrorMessage: undefined,
    formWasSubmitted: false,
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

describe('updateEmailConfirmationFormAction', () => {
  it('should handle a valid email and update state accordingly', async () => {
    const initialState = {
      ...baseInitialState,
      form: {
        ...baseInitialState.form,
        email: 'hi@example.com',
      },
    };

    const { state } = await runAction(updateEmailConfirmationFormAction, {
      props: {
        field: 'email',
        inFocus: true,
      },
      state: initialState,
    });

    expect(state.emailConfirmation.inFocusEmail).toBe(true);
    expect(state.emailConfirmation.isDirtyEmail).toBe(true);
    expect(state.emailConfirmation.emailErrorMessage).toBeUndefined();
  });

  it('should handle an invalid email and update state accordingly', async () => {
    const initialState = {
      ...baseInitialState,
      form: {
        ...baseInitialState.form,
        email: 'hi',
      },
    };
    const { state } = await runAction(updateEmailConfirmationFormAction, {
      props: {
        field: 'email',
        inFocus: true,
      },
      state: initialState,
    });

    expect(state.emailConfirmation.inFocusEmail).toBe(true);
    expect(state.emailConfirmation.isDirtyEmail).toBe(true);
    expect(state.emailConfirmation.emailErrorMessage).toBeTruthy();
  });

  it('should handle a valid confirmation email and update state accordingly', async () => {
    const initialState = {
      ...baseInitialState,
      form: {
        confirmEmail: 'hi@example.com',
        email: 'hi@example.com',
      },
    };

    const { state } = await runAction(updateEmailConfirmationFormAction, {
      props: {
        field: 'confirmEmail',
        inFocus: true,
      },
      state: initialState,
    });

    expect(state.emailConfirmation.inFocusConfirmEmail).toBe(true);
    expect(state.emailConfirmation.isDirtyConfirmEmail).toBe(true);
    expect(state.emailConfirmation.confirmEmailErrorMessage).toBeUndefined();
  });

  it('should handle a valid confirmation email and update state accordingly', async () => {
    const initialState = {
      ...baseInitialState,
      form: {
        confirmEmail: 'hi',
        email: 'hi@example.com',
      },
    };

    const { state } = await runAction(updateEmailConfirmationFormAction, {
      props: {
        field: 'confirmEmail',
        inFocus: true,
      },
      state: initialState,
    });

    expect(state.emailConfirmation.inFocusConfirmEmail).toBe(true);
    expect(state.emailConfirmation.isDirtyConfirmEmail).toBe(true);
    expect(state.emailConfirmation.confirmEmailErrorMessage).toBeTruthy();
  });
});
