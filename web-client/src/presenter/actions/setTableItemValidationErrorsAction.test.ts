import { runAction } from '@web-client/presenter/test.cerebral';
import { setTableItemValidationErrorsAction } from './setTableItemValidationErrorsAction';

describe('setTableItemValidationErrorsAction', () => {
  it('should set error object in state correctly', async () => {
    const TEST_DOCKET_NUMBER = 'TEST_NUMBER';
    const TEST_ERRORS = {
      testProp: 'value',
    };
    const { state } = await runAction(setTableItemValidationErrorsAction, {
      props: {
        docketNumber: TEST_DOCKET_NUMBER,
        errors: TEST_ERRORS,
      },
      state: {
        validationErrors: { submittedCavCasesTable: {} },
      },
    });

    expect(
      state.validationErrors.submittedCavCasesTable[TEST_DOCKET_NUMBER],
    ).toEqual(TEST_ERRORS);
  });
});
