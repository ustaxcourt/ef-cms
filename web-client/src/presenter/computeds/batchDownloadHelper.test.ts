import { batchDownloadHelper } from './batchDownloadHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('batchDownloadHelper', () => {
  it('should compute the percentage complete to display on the progress indicator', () => {
    const result = runCompute(batchDownloadHelper, {
      state: {
        batchDownloads: {
          fileCount: 5,
          totalFiles: 10,
        },
      },
    });

    expect(result.percentComplete).toEqual(50);
  });

  it('should return the progress indicator description', () => {
    const mockTitle = 'Downloading some cool stuff!';

    const result = runCompute(batchDownloadHelper, {
      state: {
        batchDownloads: {
          fileCount: 5,
          title: mockTitle,
          totalFiles: 10,
        },
      },
    });

    expect(result.progressDescription).toEqual(mockTitle);
  });
});
