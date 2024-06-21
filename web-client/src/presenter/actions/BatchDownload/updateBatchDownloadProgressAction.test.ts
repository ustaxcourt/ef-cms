import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateBatchDownloadProgressAction } from './updateBatchDownloadProgressAction';

describe('updateBatchDownloadProgressAction', () => {
  const mockFilesCompleted = 3;

  it('should update the progress state when batch_download_docket_generated event occurs', async () => {
    const result = await runAction(updateBatchDownloadProgressAction, {
      modules: {
        presenter,
      },
      props: {
        action: 'batch_download_docket_generated',
        filesCompleted: mockFilesCompleted,
        totalFile: 12,
      },
      state: {
        batchDownloads: {
          fileCount: undefined,
          title: undefined,
        },
      },
    });

    expect(result.state.batchDownloads.fileCount).toEqual(mockFilesCompleted);
    expect(result.state.batchDownloads.title).toEqual(
      'Generating Printable Docket Records and Docket Entries',
    );
  });

  it('should update the progress state when batch_download_progress event occurs', async () => {
    const result = await runAction(updateBatchDownloadProgressAction, {
      modules: {
        presenter,
      },
      props: {
        action: 'batch_download_progress',
        filesCompleted: mockFilesCompleted,
        totalFile: 12,
      },
      state: {
        batchDownloads: {
          fileCount: undefined,
          title: undefined,
        },
      },
    });

    expect(result.state.batchDownloads.fileCount).toEqual(mockFilesCompleted);
    expect(result.state.batchDownloads.title).toEqual('Compressing Files');
  });

  it('should update the progress state when batch_download_csv_data event occurs', async () => {
    const result = await runAction(updateBatchDownloadProgressAction, {
      modules: {
        presenter,
      },
      props: {
        action: 'batch_download_csv_data',
        filesCompleted: mockFilesCompleted,
        totalFile: 12,
      },
      state: {
        batchDownloads: {
          fileCount: undefined,
          title: undefined,
        },
      },
    });

    expect(result.state.batchDownloads.fileCount).toEqual(mockFilesCompleted);
    expect(result.state.batchDownloads.title).toEqual('Gathering Data');
  });
});
