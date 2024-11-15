import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultTrialSessionDetailsTabAction } from './setDefaultTrialSessionDetailsTabAction';

describe('setDefaultTrialSessionDetailsTabAction', () => {
  it('sets default trial session detail tab', async () => {
    const result = await runAction(setDefaultTrialSessionDetailsTabAction, {
      state: {
        trialSessionDetailsTab: {
          calendaredCaseList: 'hi',
        },
      },
    });

    expect(
      result.state.trialSessionDetailsTab.calendaredCaseList,
    ).toBeUndefined();
  });
});
