import { runAction } from '@web-client/presenter/test.cerebral';
import { setTrialSessionWorkingCopyKeyAction } from './setTrialSessionWorkingCopyKeyAction';

describe('setTrialSessionWorkingCopyKeyAction', () => {
  it('should reset the form state', async () => {
    const result = await runAction(setTrialSessionWorkingCopyKeyAction, {
      props: {
        key: 'testKey',
        value: 'test value',
      },
      state: {},
    });

    expect(result.state).toMatchObject({
      trialSessionWorkingCopy: {
        testKey: 'test value',
      },
    });
  });
});
