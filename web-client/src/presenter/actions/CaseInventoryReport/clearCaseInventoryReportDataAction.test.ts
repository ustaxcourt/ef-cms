import { clearCaseInventoryReportDataAction } from './clearCaseInventoryReportDataAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearCaseInventoryReportDataAction', () => {
  it('should clear the caseInventoryReportData and default screenMetadata.page to 1', async () => {
    const result = await runAction(clearCaseInventoryReportDataAction, {
      state: {
        caseInventoryReportData: [{ docketNumber: '123-20' }],
        screenMetadata: {},
      },
    });

    expect(result.state.caseInventoryReportData).toBeUndefined();
  });
});
