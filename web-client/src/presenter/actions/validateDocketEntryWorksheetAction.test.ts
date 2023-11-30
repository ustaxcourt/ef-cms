import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateDocketEntryWorksheetAction } from '@web-client/presenter/actions/validateDocketEntryWorksheetAction';

describe('validateDocketEntryWorksheetAction', () => {
  const mockSuccessPath = jest.fn();
  const mockErrorPath = jest.fn();

  presenter.providers.applicationContext = applicationContext;

  presenter.providers.path = {
    error: mockErrorPath,
    success: mockSuccessPath,
  };

  it('should call the success path when the docket entry worksheet is valid', async () => {
    applicationContext
      .getUseCases()
      .validateDocketEntryWorksheetInteractor.mockReturnValue(null);

    await runAction(validateDocketEntryWorksheetAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          docketEntryId: MOCK_CASE.docketEntries[0].docketEntryId,
          finalBriefDueDate: '2023-08-29',
          primaryIssue: 'This is a primary issue.',
          statusOfMatter: undefined,
        },
      },
    });

    expect(
      applicationContext.getUseCases().validateDocketEntryWorksheetInteractor,
    ).toHaveBeenCalled();
    expect(mockSuccessPath).toHaveBeenCalled();
  });

  it('should call the error path when the updated case worksheet is NOT valid', async () => {
    const mockErrors = {
      finalBriefDueDate: 'Enter a valid date',
    };
    applicationContext
      .getUseCases()
      .validateDocketEntryWorksheetInteractor.mockReturnValue(mockErrors);

    await runAction(validateDocketEntryWorksheetAction, {
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

    expect(mockErrorPath).toHaveBeenCalledWith({
      alertError: expect.anything(),
      errors: mockErrors,
    });
  });
});
