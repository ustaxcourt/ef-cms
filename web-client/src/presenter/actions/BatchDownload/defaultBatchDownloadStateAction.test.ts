import { defaultBatchDownloadStateAction } from './defaultBatchDownloadStateAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('defaultBatchDownloadStateAction', () => {
  it('should set state.allowRetry to false when allowRetry is undefined in props', async () => {
    const result = await runAction(defaultBatchDownloadStateAction, {
      modules: {},
      props: {},
      state: {},
    });

    expect(result.state.batchDownloads.allowRetry).toEqual(false);
  });

  it('should set state.allowRetry to the value provided in props', async () => {
    const mockAllowRetry = true;

    const result = await runAction(defaultBatchDownloadStateAction, {
      modules: {},
      props: { allowRetry: mockAllowRetry },
      state: {},
    });

    expect(result.state.batchDownloads.allowRetry).toEqual(mockAllowRetry);
  });
});
