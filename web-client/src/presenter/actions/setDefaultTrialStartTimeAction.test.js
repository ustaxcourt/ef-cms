import { runAction } from 'cerebral/test';
import { setDefaultTrialStartTimeAction } from './setDefaultTrialStartTimeAction';

describe('setDefaultTrialStartTimeAction', () => {
  it('sets state.form.startTime values to a default 10:00am value', async () => {
    const { state } = await runAction(setDefaultTrialStartTimeAction, {
      state: {
        form: {},
      },
    });

    expect(state.form).toEqual({
      startTimeExtension: 'am',
      startTimeHours: '10',
      startTimeMinutes: '00',
    });
  });
});
