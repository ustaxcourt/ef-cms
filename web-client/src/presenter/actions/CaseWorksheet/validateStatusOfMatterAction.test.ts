import { STATUS_OF_MATTER_OPTIONS } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateStatusOfMatterAction } from './validateStatusOfMatterAction';

describe('validateStatusOfMatterAction', () => {
  const TEST_DOCKET_NUMBER = '999-99';
  const TEST_STATUS_OF_MATTER = STATUS_OF_MATTER_OPTIONS[0];

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

    await runAction(validateStatusOfMatterAction as any, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: TEST_DOCKET_NUMBER,
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
      statusOfMatter: TEST_STATUS_OF_MATTER,
    });

    expect(successStub).toHaveBeenCalledWith({
      validationKey: 'statusOfMatter',
    });
    expect(errorStub).not.toHaveBeenCalled();
  });

  it('should return the error path with the error message when the final brief due date is invalid', async () => {
    const TEST_VALIDATION_ERRORS = { statusOfMatter: 'Enter a valid date' };

    applicationContext
      .getUseCases()
      .validateCaseDetailInteractor.mockReturnValue(TEST_VALIDATION_ERRORS);

    await runAction(validateStatusOfMatterAction as any, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: TEST_DOCKET_NUMBER,
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
