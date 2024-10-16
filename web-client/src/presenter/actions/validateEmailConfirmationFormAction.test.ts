import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateEmailConfirmationFormAction } from './validateEmailConfirmationFormAction';

describe('validateEmailConfirmationFormAction', () => {
  let successStub = jest.fn();
  let errorStub = jest.fn();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should return the success() path if there are no validation errors', async () => {
    await runAction(validateEmailConfirmationFormAction, {
      modules: {
        presenter,
      },
      props: {
        field: 'email',
      },
      state: {
        form: {
          confirmEmail: 'hi@example.com',
          email: 'hi@example.com',
        },
        validationErrors: {},
      },
    });

    expect(successStub).toHaveBeenCalled();
  });

  it('should return the error() path if there are validation errors', async () => {
    await runAction(validateEmailConfirmationFormAction, {
      modules: {
        presenter,
      },
      props: {
        field: 'email',
      },
      state: {
        form: {
          confirmEmail: 'hiexample.com',
          email: 'hi',
        },
        validationErrors: {},
      },
    });

    expect(errorStub).toHaveBeenCalled();
  });
});
