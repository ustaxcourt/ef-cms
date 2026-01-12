import { runAction } from '@web-client/presenter/test.cerebral';
import { setCurrentTabAction } from './setCurrentTabAction';

describe('setCurrentTabAction', () => {
  it('should set state.trialLocationPage.currentTab to props.currentTab', async () => {
    const result = await runAction(setCurrentTabAction, {
      props: {
        currentTab: 'eligibleCases',
      },
      state: {
        trialLocationPage: {
          currentTab: '',
        },
      },
    });

    expect(result.state.trialLocationPage.currentTab).toBe('eligibleCases');
  });
});
