import {
  MOCK_CASE,
  MOCK_CASE_WITH_SECONDARY_OTHERS,
} from '../../../../../shared/src/test/mockCase';
import { runAction } from 'cerebral/test';
import { setupConsolidatedCasesAction } from './setupConsolidatedCasesAction';

describe('primePropsForCanConsolidateAction', () => {
  it('should update the props from state', async () => {
    const result = await runAction(setupConsolidatedCasesAction, {
      state: {
        caseDetail: {
          ...MOCK_CASE,
          consolidatedCases: [MOCK_CASE, MOCK_CASE_WITH_SECONDARY_OTHERS],
        },
      },
    });

    expect(result.output).toEqual({
      caseDetail: '123',
      caseToConsolidate: '345',
      confirmSelection: false,
    });
  });
});
