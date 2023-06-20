import { clearOptionalCustomCaseInventoryFilterAction } from './clearOptionalCustomCaseInventoryFilterAction';
import { cloneDeep } from 'lodash';
import { initialCustomCaseInventoryReportState } from '../../customCaseInventoryReportState';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearOptionalCustomCaseInventoryFilterAction', () => {
  it('should set case statues and caseTypes to empty arrays', async () => {
    const customCaseInventoryReportState = cloneDeep(
      initialCustomCaseInventoryReportState,
    );
    customCaseInventoryReportState.filters.caseStatuses = ['CAV'];
    customCaseInventoryReportState.filters.caseTypes = ['CDP (Lien/Levy)'];
    customCaseInventoryReportState.filters.judges = ['Buch'];
    customCaseInventoryReportState.filters.preferredTrialCities = [
      'Detroit, Michigan',
    ];

    const result = await runAction(
      clearOptionalCustomCaseInventoryFilterAction,
      {
        state: { customCaseInventory: customCaseInventoryReportState },
      },
    );

    expect(result.state.customCaseInventory.filters.caseStatuses).toEqual([]);
    expect(result.state.customCaseInventory.filters.caseTypes).toEqual([]);
    expect(result.state.customCaseInventory.filters.judges).toEqual([]);
    expect(
      result.state.customCaseInventory.filters.preferredTrialCities,
    ).toEqual([]);
  });
});
