import { runAction } from '@web-client/presenter/test.cerebral';
import { updateTrialSessionInTrialSessionsAction } from './updateTrialSessionInTrialSessionsAction';

describe('updateTrialSessionInTrialSessionsAction', () => {
  it('should update the associated trial session in state.trialSessions from props.trialSession', async () => {
    const result = await runAction(updateTrialSessionInTrialSessionsAction, {
      props: {
        trialSession: {
          caseOrder: [
            {
              calendarNotes: 'yee to the haw',
              docketNumber: '123-20',
            },
          ],
          trialSessionId: 'trial-session-id-1',
        },
      },
      state: {
        trialSessions: [
          {
            caseOrder: [
              {
                calendarNotes: 'yeehaw',
                docketNumber: '123-20',
              },
            ],
            trialSessionId: 'trial-session-id-1',
          },
        ],
      },
    });

    expect(result.state.trialSessions[0].caseOrder).toEqual([
      {
        calendarNotes: 'yee to the haw',
        docketNumber: '123-20',
      },
    ]);
  });
});
