import { defaultBatchDownloadStateAction } from './defaultBatchDownloadStateAction';
import { runAction } from 'cerebral/test';

describe('defaultBatchDownloadStateAction', () => {
  it('should set the allowRetry state to false when allowRetry is not a truthy props', async () => {
    const result = await runAction(defaultBatchDownloadStateAction, {
      modules: {},
      props: {},
      state: {},
    });
    expect(result.state.batchDownloads.allowRetry).toEqual(false);
  });

  it('should set the allowRetry state to true when allowRetry is a truthy props', async () => {
    const result = await runAction(defaultBatchDownloadStateAction, {
      modules: {},
      props: { allowRetry: true },
      state: {},
    });
    expect(result.state.batchDownloads.allowRetry).toEqual(true);
  });

  it('should set the prop for trialSessionId based off of the current trial session', async () => {
    const result = await runAction(defaultBatchDownloadStateAction, {
      modules: {},
      props: { allowRetry: true },
      state: { trialSession: { trialSessionId: 'abc' } },
    });
    expect(result.output.trialSessionId).toEqual('abc');
  });
});
