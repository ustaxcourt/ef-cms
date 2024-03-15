import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateNewPetitionerAction } from '@web-client/presenter/actions/CreateAccount/validateNewPetitionerAction';

describe('validateNewPetitionerAction', () => {
  const mockValidPath = jest.fn();
  const mockInvalidPath = jest.fn();

  const TEST_EMAIL = 'example@example.com';
  const TEST_NAME = 'Jason Isbell';
  const TEST_PASSWORD = 'aA1!aaaa';
  const TEST_CONFIRM_PASSWORD = TEST_PASSWORD;

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      invalid: mockInvalidPath,
      valid: mockValidPath,
    };
  });

  it('should call the valid path when the petitionerUserForm passes validation', async () => {
    await runAction(validateNewPetitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          confirmPassword: TEST_CONFIRM_PASSWORD,
          email: TEST_EMAIL,
          name: TEST_NAME,
          password: TEST_PASSWORD,
        },
      },
    });

    expect(mockValidPath.mock.calls.length).toEqual(1);
    expect(mockInvalidPath).not.toHaveBeenCalled();
  });

  it('should call the invalid path when the petitionerUserForm has an invalid email', async () => {
    await runAction(validateNewPetitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          confirmPassword: TEST_CONFIRM_PASSWORD,
          email: 'invalid@example',
          name: TEST_NAME,
          password: TEST_PASSWORD,
        },
      },
    });

    expect(mockInvalidPath.mock.calls.length).toEqual(1);
    expect(mockValidPath).not.toHaveBeenCalled();
  });

  it('should call the invalid path when the petitionerUserForm is missing name', async () => {
    await runAction(validateNewPetitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          confirmPassword: TEST_CONFIRM_PASSWORD,
          email: TEST_EMAIL,
          name: '',
          password: TEST_PASSWORD,
        },
      },
    });

    expect(mockInvalidPath.mock.calls.length).toEqual(1);
    expect(mockValidPath).not.toHaveBeenCalled();
  });

  it('should call the invalid path when the petitionerUserForm has incongruent password and confirmPassword fields', async () => {
    await runAction(validateNewPetitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          confirmPassword: TEST_CONFIRM_PASSWORD,
          email: TEST_EMAIL,
          name: TEST_NAME,
          password: 'not_test_password',
        },
      },
    });

    expect(mockInvalidPath.mock.calls.length).toEqual(1);
    expect(mockValidPath).not.toHaveBeenCalled();
  });

  it('should call the invalid path when the petitionerUserForm has an invalid password', async () => {
    const mockInvalidPassword = 'abc';

    await runAction(validateNewPetitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          confirmPassword: mockInvalidPassword,
          email: TEST_EMAIL,
          name: TEST_NAME,
          password: mockInvalidPassword,
        },
      },
    });

    expect(mockInvalidPath.mock.calls.length).toEqual(1);
    expect(mockValidPath).not.toHaveBeenCalled();
  });
});
