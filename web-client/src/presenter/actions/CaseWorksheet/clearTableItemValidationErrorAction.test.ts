import { MOCK_CASE } from '@shared/test/mockCase';
import { clearTableItemValidationErrorAction } from './clearTableItemValidationErrorAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearTableItemValidationErrorAction', () => {
  it('should clear error object in state correctly', async () => {
    const TEST_ERRORS = {
      anotherTestProp: 'And anotha one.',
      testProp: 'value',
    };

    const { state } = await runAction(clearTableItemValidationErrorAction, {
      props: {
        docketNumber: MOCK_CASE.docketNumber,
        validationKey: 'testProp',
      },
      state: {
        validationErrors: {
          submittedCavCasesTable: { [MOCK_CASE.docketNumber]: TEST_ERRORS },
        },
      },
    });

    expect(
      state.validationErrors.submittedCavCasesTable[MOCK_CASE.docketNumber],
    ).toEqual({
      anotherTestProp: 'And anotha one.',
    });
  });
});
