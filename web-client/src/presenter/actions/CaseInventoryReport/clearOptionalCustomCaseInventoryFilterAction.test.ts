import { clearOptionalCustomCaseInventoryFilterAction } from './clearOptionalCustomCaseInventoryFilterAction';
import { cloneDeep } from 'lodash';
import { initialCustomCaseInventoryReportState } from '../../customCaseInventoryReportState';
import { runAction } from 'cerebral/test';

describe('clearOptionalCustomCaseInventoryFilterAction', () => {
  it('should set case statues and caseTypes to empty arrays', async () => {
    const customCaseInventoryReportState = cloneDeep(
      initialCustomCaseInventoryReportState,
    );
    customCaseInventoryReportState.filters.caseStatuses = ['CAV'];
    customCaseInventoryReportState.filters.caseTypes = ['CDP (Lien/Levy)'];

    const result = await runAction(
      clearOptionalCustomCaseInventoryFilterAction,
      {
        state: { customCaseInventory: customCaseInventoryReportState },
      },
    );

    expect(result.state.customCaseInventory.filters.caseStatuses).toEqual([]);
    expect(result.state.customCaseInventory.filters.caseTypes).toEqual([]);
  });
});
