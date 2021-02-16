import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateChangePetitionerLoginAndServiceEmailAction } from './validateChangePetitionerLoginAndServiceEmailAction';

const errorMock = jest.fn();
const successMock = jest.fn();

describe('validateChangePetitionerLoginAndServiceEmailAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorMock,
      success: successMock,
    };
  });

  it('should return the error path if update user email form is invalid', async () => {
    applicationContext
      .getUseCases()
      .validateUpdateUserEmailInteractor.mockReturnValue(
        'something went wrong',
      );

    runAction(validateChangePetitionerLoginAndServiceEmailAction, {
      modules: {
        presenter,
      },
      state: { form: {} },
    });

    expect(errorMock.mock.calls[0][0]).toMatchObject({
      errors: {
        contactPrimary: 'something went wrong',
        contactSecondary: undefined,
      },
    });
  });

  it('should return the success path if update user email form is valid', async () => {
    applicationContext
      .getUseCases()
      .validateUpdateUserEmailInteractor.mockReturnValue(undefined);

    runAction(validateChangePetitionerLoginAndServiceEmailAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          contactPrimary: {
            confirmEmail: 'test@example.com',
            email: 'test@example.com',
          },
        },
      },
    });

    expect(successMock).toHaveBeenCalled();
  });

  it('should validate the contactSecondary email if present', async () => {
    applicationContext
      .getUseCases()
      .validateUpdateUserEmailInteractor.mockReturnValue(undefined);

    runAction(validateChangePetitionerLoginAndServiceEmailAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          contactPrimary: {
            confirmEmail: 'test@example.com',
            email: 'test@example.com',
          },
          contactSecondary: {
            confirmEmail: 'test_secondary@example.com',
            email: 'test_secondary@example.com',
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().validateUpdateUserEmailInteractor,
    ).toHaveBeenCalledTimes(2);
    expect(successMock).toHaveBeenCalled();
  });

  it('should return the error path if the contactPrimary email is valid but the contactSecondary email is invalid', async () => {
    applicationContext
      .getUseCases()
      .validateUpdateUserEmailInteractor.mockImplementation(
        ({ updateUserEmail }) => {
          if (updateUserEmail.email === 'invalid_email') {
            return 'something went wrong';
          } else {
            undefined;
          }
        },
      );

    runAction(validateChangePetitionerLoginAndServiceEmailAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          contactPrimary: {
            confirmEmail: 'test@example.com',
            email: 'test@example.com',
          },
          contactSecondary: {
            confirmEmail: 'not_same@example.com',
            email: 'invalid_email',
          },
        },
      },
    });

    expect(errorMock.mock.calls[0][0]).toMatchObject({
      errors: {
        contactPrimary: undefined,
        contactSecondary: 'something went wrong',
      },
    });
  });
});
