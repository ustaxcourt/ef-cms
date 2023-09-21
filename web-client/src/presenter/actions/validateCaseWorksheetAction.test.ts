import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateCaseWorksheetAction } from './validateCaseWorksheetAction';

describe('validateCaseWorksheetAction', () => {
  let successStub;
  let errorStub;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };

    presenter.providers.applicationContext = applicationContext;
  });

  it('should call the success path when the updated case worksheet is valid', async () => {
    applicationContext
      .getUseCases()
      .validateCaseWorksheetInteractor.mockReturnValue(null);

    await runAction(validateCaseWorksheetAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          docketNumber: MOCK_CASE.docketNumber,
          finalBriefDueDate: '2023-08-29',
          primaryIssue: 'This is a primary issue.',
          statusOfMatter: undefined,
        },
      },
    });

    expect(
      applicationContext.getUseCases().validateCaseWorksheetInteractor,
    ).toHaveBeenCalled();
    expect(successStub).toHaveBeenCalled();
  });

  it('should call the error path when the updated case worksheet is NOT valid', async () => {
    const mockErrors = {
      finalBriefDueDate: 'Enter a valid date',
    };
    applicationContext
      .getUseCases()
      .validateCaseWorksheetInteractor.mockReturnValue(mockErrors);

    await runAction(validateCaseWorksheetAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          docketNumber: MOCK_CASE.docketNumber,
          finalBriefDueDate: 'abcdef', // this is not a valid due date
          primaryIssue: 'This is a primary issue.',
          statusOfMatter: undefined,
        },
      },
    });

    expect(errorStub).toHaveBeenCalledWith({
      alertError: expect.anything(),
      errors: mockErrors,
    });
  });
});
