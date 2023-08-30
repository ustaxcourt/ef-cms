import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateSubmittedCavCaseBriefDueDateAction } from './validateSubmittedCavCaseBriefDueDateAction';

describe('validateSubmittedCavCaseBriefDueDateAction', () => {
  const TEST_DOCKET_NUMBER = '999-99';
  const TEST_FINAL_BRIEF_DUE_DATE = '08/28/2023';
  const TEST_STATUS_OF_MATTER = 'Drafting';

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

  it('should return the success path with the computed final brief due date when the case updates are valid', async () => {
    applicationContext
      .getUseCases()
      .validateCaseDetailInteractor.mockReturnValue(null);

    await runAction(validateSubmittedCavCaseBriefDueDateAction as any, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: TEST_DOCKET_NUMBER,
        finalBriefDueDate: TEST_FINAL_BRIEF_DUE_DATE,
        statusOfMatter: TEST_STATUS_OF_MATTER,
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
      statusOfMatter: TEST_STATUS_OF_MATTER,
    });

    expect(successStub).toHaveBeenCalled();
    expect(errorStub).not.toHaveBeenCalled();
  });

  it('should return the error path with the error message when the final brief due date is invalid', async () => {
    const TEST_VALIDATION_ERRORS = { finalBriefDueDate: 'Enter a valid date' };

    applicationContext
      .getUseCases()
      .validateCaseDetailInteractor.mockReturnValue(TEST_VALIDATION_ERRORS);

    await runAction(validateSubmittedCavCaseBriefDueDateAction as any, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: TEST_DOCKET_NUMBER,
        finalBriefDueDate: TEST_FINAL_BRIEF_DUE_DATE,
        statusOfMatter: TEST_STATUS_OF_MATTER,
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
