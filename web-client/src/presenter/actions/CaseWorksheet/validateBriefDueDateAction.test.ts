import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateBriefDueDateAction } from './validateBriefDueDateAction';

describe('validateBriefDueDateAction', () => {
  const TEST_BRIEF_DUE_DATE = '08/28/2023';

  let successStub;
  let errorStub;

  beforeEach(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should use the docket number from props to validate/create a new case worksheet when one does not already exist for the case', async () => {
    await runAction(validateBriefDueDateAction as any, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: MOCK_CASE.docketNumber,
        finalBriefDueDate: TEST_BRIEF_DUE_DATE,
      },
      state: {
        submittedAndCavCases: {
          worksheets: [],
        },
      },
    });

    expect(
      applicationContext.getUseCases().validateCaseWorksheetInteractor.mock
        .calls[0][0].caseWorksheet.docketNumber,
    ).toEqual(MOCK_CASE.docketNumber);
  });

  it('should return the success path with the validation key to unset in state when the updated case is valid', async () => {
    applicationContext
      .getUseCases()
      .validateCaseWorksheetInteractor.mockReturnValue(null);

    await runAction(validateBriefDueDateAction as any, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: MOCK_CASE.docketNumber,
        finalBriefDueDate: TEST_BRIEF_DUE_DATE,
      },
      state: {
        submittedAndCavCases: {
          worksheets: [
            {
              docketNumber: MOCK_CASE.docketNumber,
            },
          ],
        },
      },
    });

    expect(
      applicationContext.getUseCases().validateCaseWorksheetInteractor.mock
        .calls[0][0].caseWorksheet,
    ).toMatchObject({
      finalBriefDueDate: '2023-08-28',
    });
    expect(successStub).toHaveBeenCalledWith({
      finalBriefDueDate: '2023-08-28',
      validationKey: 'finalBriefDueDate',
    });
    expect(errorStub).not.toHaveBeenCalled();
  });

  it('should return the error path with the error message when the final brief due date is invalid', async () => {
    const TEST_VALIDATION_ERRORS = { finalBriefDueDate: 'Enter a valid date' };

    applicationContext
      .getUseCases()
      .validateCaseWorksheetInteractor.mockReturnValue(TEST_VALIDATION_ERRORS);

    await runAction(validateBriefDueDateAction as any, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: MOCK_CASE.docketNumber,
        finalBriefDueDate: TEST_BRIEF_DUE_DATE,
      },
      state: {
        submittedAndCavCases: {
          worksheets: [
            {
              docketNumber: MOCK_CASE.docketNumber,
            },
          ],
        },
      },
    });

    expect(errorStub).toHaveBeenCalledWith({ errors: TEST_VALIDATION_ERRORS });
    expect(successStub).not.toHaveBeenCalled();
  });
});
