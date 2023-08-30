import { clearTableItemValidationErrorAction } from './clearTableItemValidationErrorAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearTableItemValidationErrorAction', () => {
  it('should clear error object in state correctly', async () => {
    const TEST_DOCKET_NUMBER = 'TEST_NUMBER';
    const TEST_ERRORS = {
      anotherTestProp: 'And anotha one.',
      testProp: 'value',
    };
    const { state } = await runAction(clearTableItemValidationErrorAction, {
      props: {
        docketNumber: TEST_DOCKET_NUMBER,
        validationKey: 'testProp',
      },
      state: {
        validationErrors: {
          submittedCavCasesTable: { [TEST_DOCKET_NUMBER]: TEST_ERRORS },
        },
      },
    });

    expect(
      state.validationErrors.submittedCavCasesTable[TEST_DOCKET_NUMBER],
    ).toEqual({
      anotherTestProp: 'And anotha one.',
    });
  });
});
