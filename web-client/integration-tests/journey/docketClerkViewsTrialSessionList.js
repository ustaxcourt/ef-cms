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

    // const result = await runCompute(trialCitiesHelperComputed)(
    //   'AllPlusStandalone',
    // );

    console.log('result', result);

    // const { trialCitiesByState } = result();

    // console.log('trialCitiesByState', trialCitiesByState);

    // trialCitiesByState

    // expect(trialCitiesByState).toEqual(formattedCitiesWithStandaloneOption);

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
