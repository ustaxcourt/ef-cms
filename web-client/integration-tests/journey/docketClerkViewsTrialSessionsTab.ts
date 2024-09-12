import {
  isTrialSessionRow,
  trialSessionsHelper as trialSessionsHelperComputed,
} from '@web-client/presenter/computeds/trialSessionsHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkViewsTrialSessionsTab = (
  cerebralTest: any,
  overrides: {
    tab?: 'calendared' | 'new';
    sessionStatus?: 'Closed' | 'Open' | 'All';
  } = {
    sessionStatus: 'Open',
    tab: 'calendared',
  },
) => {
  const { tab } = overrides;
  return it(`Docket clerk views ${tab} Trial Sessions tab`, async () => {
    await cerebralTest.runSequence('gotoTrialSessionsSequence');
    await cerebralTest.runSequence('setTrialSessionsFiltersSequence', {
      currentTab: tab,
    });
    await cerebralTest.runSequence('setTrialSessionsFiltersSequence', {
      sessionStatus: overrides.sessionStatus,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('TrialSessions');

    const trialSessionsHelper = withAppContextDecorator(
      trialSessionsHelperComputed,
    );

    const helper = runCompute(trialSessionsHelper, {
      state: cerebralTest.getState(),
    });

    const legacyJudge = helper.trialSessionJudges.find(
      judge => judge.role === 'legacyJudge',
    );

    if (tab === 'calendared') {
      expect(legacyJudge).toBeTruthy();
    } else {
      expect(legacyJudge).toBeFalsy();
    }

    const foundSession = helper.trialSessionRows
      .filter(isTrialSessionRow)
      .find(t => t.trialSessionId === cerebralTest.trialSessionId);

    expect(foundSession).toBeTruthy();
  });
};
