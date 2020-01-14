import { addCaseToTrialSessionCalendarAlertWarningAction } from './addCaseToTrialSessionCalendarAlertWarningAction';
import { runAction } from 'cerebral/test';

describe('addCaseToTrialSessionCalendarAlertWarningAction', () => {
  it('should set state.alertWarning with the print paper service for parties message', async () => {
    const result = await runAction(
      addCaseToTrialSessionCalendarAlertWarningAction,
      {
        props: {
          caseDetail: {
            docketNumber: '101-19',
          },
        },
      },
    );

    expect(result.output).toEqual({
      alertWarning: {
        message:
          '101-19 has parties receiving paper service. Print and mail all paper service documents below.',
      },
    });
  });
});
