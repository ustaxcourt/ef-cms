import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateBatchDownloadProgressAction } from './updateBatchDownloadProgressAction';

describe('updateBatchDownloadProgressAction', () => {
  it('should set the state as docket records are generated', async () => {
    const result = await runAction(updateBatchDownloadProgressAction, {
      modules: {
        presenter,
      },
      props: {
        action: 'batch_download_docket_generated',
        entries: { processed: 2 },
        numberOfDocketRecordsGenerated: 2,
        numberOfDocketRecordsToGenerate: 2,
      },
    });
    expect(result.state.batchDownloads.fileCount).toEqual(2);
  });

  it('should set the state when the zip streaming begins', async () => {
    const result = await runAction(updateBatchDownloadProgressAction, {
      modules: {
        presenter,
      },
      props: {
        action: 'batch_download_upload_start',
        numberOfDocketRecordsToGenerate: 4,
      },
    });
    expect(result.state.batchDownloads.fileCount).toEqual(4);
  });

  it('should set use the max done with the files', async () => {
    const result = await runAction(updateBatchDownloadProgressAction, {
      modules: {
        presenter,
      },
      props: {
        action: 'batch_download_progress',
        entries: { processed: 2 },
        numberOfDocketRecordsToGenerate: 2,
      },
      state: {
        batchDownloads: { fileCount: 10 },
      },
    });
    expect(result.state.batchDownloads.fileCount).toEqual(10);
  });
});
