import { getAddCaseToTrialSessionCalendarAlertWarningAction } from './getAddCaseToTrialSessionCalendarAlertWarningAction';
import { runAction } from 'cerebral/test';

describe('getAddCaseToTrialSessionCalendarAlertWarningAction', () => {
  it('should set state.alertWarning with the print paper service for parties message', async () => {
    const result = await runAction(
      getAddCaseToTrialSessionCalendarAlertWarningAction,
      {
        props: {
          caseDetail: {
            docketNumber: '101-19',
            docketNumberSuffix: 'P',
          },
        },
      },
    );

    expect(result.output).toEqual({
      alertWarning: {
        message:
          '101-19P has parties receiving paper service. Print and mail all paper service documents below.',
      },
    });
  });
});
