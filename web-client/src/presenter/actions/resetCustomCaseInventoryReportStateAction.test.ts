import {
  CustomCaseInventoryReportState,
  initialCustomCaseInventoryReportState,
} from '../customCaseInventoryReportState';
import { resetCustomCaseInventoryReportStateAction } from './resetCustomCaseInventoryReportStateAction';
import { runAction } from 'cerebral/test';

describe('resetCustomCaseInventoryReportStateAction', () => {
  it('resets the customCaseInventory back to its default state', async () => {
    const modifiedCustomCaseInventoryReport: CustomCaseInventoryReportState = {
      ...initialCustomCaseInventoryReportState,
      totalCases: 124,
    };

    const { state } = await runAction(
      resetCustomCaseInventoryReportStateAction,
      {
        state: {
          customCaseInventory: modifiedCustomCaseInventoryReport,
        },
      },
    );

    expect(state.customCaseInventory).toEqual(
      initialCustomCaseInventoryReportState,
    );
  });
});
