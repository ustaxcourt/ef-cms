import { runAction } from '@web-client/presenter/test.cerebral';
import { setTrialStartTimeAction } from './setTrialStartTimeAction';

describe('setTrialStartTimeAction', () => {
  it('should set state.form.startTimeExtension from props.startTimeExtension', async () => {
    const mockStartTimeExtension = 'A.M.';

    const { state } = await runAction(setTrialStartTimeAction, {
      props: {
        startTimeExtension: mockStartTimeExtension,
      },
      state: {},
    });

    expect(state.form.startTimeExtension).toBe(mockStartTimeExtension);
  });

  it('should set state.form.startTimeHours from props.startTimeHours', async () => {
    const startTimeHours = 19;

    const { state } = await runAction(setTrialStartTimeAction, {
      props: {
        startTimeHours,
      },
      state: {},
    });

    expect(state.form.startTimeHours).toBe(startTimeHours);
  });

  it('should set state.form.startTimeMinutes from props.startTimeMinutes', async () => {
    const startTimeMinutes = 59;

    const { state } = await runAction(setTrialStartTimeAction, {
      props: {
        startTimeMinutes,
      },
      state: {},
    });

    expect(state.form.startTimeMinutes).toBe(startTimeMinutes);
  });
});
