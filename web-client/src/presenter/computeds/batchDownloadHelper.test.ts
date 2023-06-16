import { batchDownloadHelper } from './batchDownloadHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('batchDownloadHelper', () => {
  it('returns expected data when state.batchDownloads contains fileCount and totalFiles', () => {
    const result = runCompute(batchDownloadHelper, {
      state: {
        batchDownloads: {
          fileCount: 5,
          totalFiles: 10,
        },
      },
    });
    expect(result).toMatchObject({
      addedFiles: 5,
      percentComplete: 50,
      totalFiles: 10,
    });
  });

  it('returns expected data when state.batchDownloads does not contain fileCount and totalFiles', () => {
    const result = runCompute(batchDownloadHelper, {
      state: {
        batchDownloads: {},
      },
    });
    expect(result).toMatchObject({
      addedFiles: 0,
      percentComplete: NaN,
      totalFiles: 0,
    });
  });
});
