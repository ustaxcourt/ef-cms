import { runAction } from 'cerebral/test';
import { setTrialSessionCalendarAlertWarningAction } from './setTrialSessionCalendarAlertWarningAction';

describe('setTrialSessionCalendarAlertWarningAction', () => {
  it('should update the state from state', async () => {
    const result = await runAction(setTrialSessionCalendarAlertWarningAction);

    expect(result.output).toEqual({
      alertWarning: {
        message:
          'These cases have parties receiving paper service. Print and mail all paper service documents below.',
      },
    });
  });
});
