import { presenter } from '@web-client/presenter/presenter';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setCustomCaseReportBatchDownloadAction } from '@web-client/presenter/actions/CaseInventoryReport/setCustomCaseReportBatchDownloadAction';

describe('setCustomCaseReportBatchDownloadAction', () => {
  it('should test', async () => {
    const results = await runAction(setCustomCaseReportBatchDownloadAction, {
      modules: {
        presenter,
      },
      state: {
        batchDownloads: {
          title: 'test',
          zipInProgress: false,
        },
      },
    });

    expect(results.state.batchDownloads.zipInProgress).toEqual(true);
    expect(results.state.batchDownloads.title).toEqual('Gathering Data');
  });
});
