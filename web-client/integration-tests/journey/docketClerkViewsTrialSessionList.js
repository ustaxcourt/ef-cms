import { find } from 'lodash';
import { formattedTrialSessions as formattedTrialSessionsComputed } from '../../src/presenter/computeds/formattedTrialSessions';
import { runCompute } from 'cerebral/test';
import { trialCitiesHelper as trialCitiesHelperComputed } from '../../src/presenter/computeds/trialCitiesHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedTrialSessions = withAppContextDecorator(
  formattedTrialSessionsComputed,
);

export const docketClerkViewsTrialSessionList = cerebralTest => {
  return it('Docket clerk views trial session list', async () => {
    await cerebralTest.runSequence('gotoTrialSessionsSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('TrialSessions');

    const result = await runCompute(
      withAppContextDecorator(trialCitiesHelperComputed),
    )('AllPlusStandalone');

    expect(result.trialCitiesByState[0]).toEqual('Standalone Remote');
    expect(
      result.trialCitiesByState[result.trialCitiesByState.length - 1],
    ).toEqual({ cities: ['Cheyenne, Wyoming'], state: 'Wyoming' });

    const formatted = runCompute(formattedTrialSessions, {
      state: cerebralTest.getState(),
    });
    expect(formatted.formattedSessions.length).toBeGreaterThan(0);

    const trialSession = find(formatted.sessionsByTerm, {
      trialSessionId: cerebralTest.lastCreatedTrialSessionId,
    });

    expect(trialSession).toBeDefined();

    cerebralTest.trialSessionId = trialSession && trialSession.trialSessionId;
    if (cerebralTest.createdTrialSessions) {
      cerebralTest.createdTrialSessions.push(cerebralTest.trialSessionId);
    }
  });
};
