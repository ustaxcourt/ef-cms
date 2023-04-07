import { clearOptionalCustomCaseInventoryFilterAction } from './clearOptionalCustomCaseInventoryFilterAction';
import { runAction } from 'cerebral/test';

describe('clearOptionalCustomCaseInventoryFilterAction', () => {
  it('should set case statues and caseTypes to empty arrays', async () => {
    const result = await runAction(
      clearOptionalCustomCaseInventoryFilterAction,
      {
        state: {
          customCaseInventoryFilters: {
            caseStatuses: ['Assigned - Case', 'CAV'],
            caseTypes: ['Disclosure', 'Deficiency'],
            createEndDate: '09/15/2023',
            createStartDate: '09/15/2012',
            filingMethod: 'paper',
          },
        },
      },
    );

    expect(result.state.customCaseInventoryFilters).toEqual({
      caseStatuses: [],
      caseTypes: [],
      createEndDate: '09/15/2023',
      createStartDate: '09/15/2012',
      filingMethod: 'paper',
    });
  });
});
