import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
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
        modal: {},
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
        modal: {},
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
