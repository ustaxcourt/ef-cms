import { runAction } from '@web-client/presenter/test.cerebral';
import { setTrialSessionCalendarAlertWarningAction } from './setTrialSessionCalendarAlertWarningAction';

describe('setTrialSessionCalendarAlertWarningAction', () => {
  it('should set state.alertWarning with the print paper service for parties message', async () => {
    const result = await runAction(setTrialSessionCalendarAlertWarningAction);

    expect(result.output).toEqual({
      alertWarning: {
        message: 'Print and mail all paper service documents now.',
      },
    });
  });
});
