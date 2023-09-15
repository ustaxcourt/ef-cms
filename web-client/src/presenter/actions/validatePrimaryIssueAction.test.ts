import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validatePrimaryIssueAction } from './validatePrimaryIssueAction';

describe('validatePrimaryIssueAction', () => {
  let successMock;
  let errorMock;

  beforeAll(() => {
    successMock = jest.fn();
    errorMock = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorMock,
      success: successMock,
    };
  });

  it('should return the success path when the primary issue note is valid', () => {
    applicationContext
      .getUseCases()
      .validateCaseWorksheetInteractor.mockReturnValue(null);

    runAction(validatePrimaryIssueAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          docketNumber: MOCK_CASE.docketNumber,
          primaryIssue: 'abcdefg',
        },
      },
    });

    expect(successMock).toHaveBeenCalled();
    expect(errorMock).not.toHaveBeenCalled();
  });

  it('should return the error when the primary issue note is invalid', () => {
    const validationError = { testProp: true };
    applicationContext
      .getUseCases()
      .validateCaseWorksheetInteractor.mockReturnValue(validationError);

    runAction(validatePrimaryIssueAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          docketNumber: MOCK_CASE.docketNumber,
          primaryIssue: 12345, // primaryIssue must be a string
        },
      },
    });

    expect(errorMock).toHaveBeenCalled();
    const expectedErrorOptions = {
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors: validationError,
    };
    expect(errorMock.mock.calls[0][0]).toMatchObject(expectedErrorOptions);
    expect(successMock).not.toHaveBeenCalled();
  });
});
