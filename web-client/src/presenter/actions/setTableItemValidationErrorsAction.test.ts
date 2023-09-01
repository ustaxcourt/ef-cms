import { MOCK_CASE } from '@shared/test/mockCase';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setTableItemValidationErrorsAction } from './setTableItemValidationErrorsAction';

describe('setTableItemValidationErrorsAction', () => {
  it('should set error object in state correctly', async () => {
    const TEST_ERRORS = {
      testProp: 'value',
    };

    const { state } = await runAction(setTableItemValidationErrorsAction, {
      props: {
        docketNumber: MOCK_CASE.docketNumber,
        errors: TEST_ERRORS,
      },
      state: {
        validationErrors: { submittedCavCasesTable: {} },
      },
    });

    expect(
      state.validationErrors.submittedCavCasesTable[MOCK_CASE.docketNumber],
    ).toEqual(TEST_ERRORS);
  });
});
