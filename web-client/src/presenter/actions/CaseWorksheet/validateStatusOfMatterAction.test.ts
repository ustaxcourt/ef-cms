import { MOCK_CASE } from '@shared/test/mockCase';
import { STATUS_OF_MATTER_OPTIONS } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateStatusOfMatterAction } from './validateStatusOfMatterAction';

describe('validateStatusOfMatterAction', () => {
  const TEST_STATUS_OF_MATTER = STATUS_OF_MATTER_OPTIONS[0];

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
    await runAction(validateStatusOfMatterAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: MOCK_CASE.docketNumber,
        statusOfMatter: TEST_STATUS_OF_MATTER,
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

  it('should return the success path with the validation key to unset in state when the updated case worksheet is valid', async () => {
    await runAction(validateStatusOfMatterAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: MOCK_CASE.docketNumber,
        statusOfMatter: TEST_STATUS_OF_MATTER,
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
      statusOfMatter: TEST_STATUS_OF_MATTER,
    });
    expect(successStub).toHaveBeenCalledWith({
      validationKey: 'statusOfMatter',
    });
    expect(errorStub).not.toHaveBeenCalled();
  });

  it('should return the error path with the error message when the final brief due date is invalid', async () => {
    const TEST_VALIDATION_ERRORS = { finalBriefDueDate: 'Enter a valid date' };

    applicationContext
      .getUseCases()
      .validateCaseWorksheetInteractor.mockReturnValue(TEST_VALIDATION_ERRORS);

    await runAction(validateStatusOfMatterAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: MOCK_CASE.docketNumber,
        finalBriefDueDate: 'abcdef', // Final brief due date should be a date string formatted as 'YYYY-MM-DD'
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
