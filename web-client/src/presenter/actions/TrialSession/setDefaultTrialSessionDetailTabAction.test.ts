import { runAction } from 'cerebral/test';
import { setDefaultTrialSessionDetailTabAction } from './setDefaultTrialSessionDetailTabAction';

describe('setDefaultTrialSessionDetailTabAction', () => {
  it('sets default trial session detail tab', async () => {
    const result = await runAction(setDefaultTrialSessionDetailTabAction, {
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
