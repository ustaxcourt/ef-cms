import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateBriefDueDateAction } from './validateBriefDueDateAction';

describe('validateBriefDueDateAction', () => {
  const TEST_DOCKET_NUMBER = '999-99';
  const TEST_BRIEF_DUE_DATE = '08/28/2023';

  let successStub;
  let errorStub;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should return the success path with the validation key to unset in state when the updated case is valid', async () => {
    applicationContext
      .getUseCases()
      .validateCaseDetailInteractor.mockReturnValue(null);

    await runAction(validateBriefDueDateAction as any, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: TEST_DOCKET_NUMBER,
        finalBriefDueDate: TEST_BRIEF_DUE_DATE,
      },
      state: {
        judgeActivityReportData: {
          submittedAndCavCasesByJudge: [
            {
              docketNumber: TEST_DOCKET_NUMBER,
            },
          ],
        },
      },
    });

    expect(
      applicationContext.getUseCases().validateCaseDetailInteractor.mock
        .calls[0][1].caseDetail,
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
      .validateCaseDetailInteractor.mockReturnValue(TEST_VALIDATION_ERRORS);

    await runAction(validateBriefDueDateAction as any, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: TEST_DOCKET_NUMBER,
        finalBriefDueDate: TEST_BRIEF_DUE_DATE,
      },
      state: {
        judgeActivityReportData: {
          submittedAndCavCasesByJudge: [
            {
              docketNumber: TEST_DOCKET_NUMBER,
            },
          ],
        },
      },
    });

    expect(errorStub).toHaveBeenCalledWith({ errors: TEST_VALIDATION_ERRORS });
    expect(successStub).not.toHaveBeenCalled();
  });
});
