import { runCompute } from 'cerebral/test';
import { trialSessionHeaderHelper as trialSessionHeaderHelperComputed } from './trialSessionHeaderHelper';
import { withAppContextDecorator } from '../../withAppContext';

let currentUser = {
  role: 'judge',
  userId: '777',
};

const trialSessionHeaderHelper = withAppContextDecorator(
  trialSessionHeaderHelperComputed,
  {
    getCurrentUser: () => currentUser,
  },
);

describe('trial session helper computed', () => {
  it('computes defaults with no data', () => {
    const result = runCompute(trialSessionHeaderHelper, {});
    expect(result).toBeDefined();
  });

  it('does not show switch-links in header if not the assigned judge', () => {
    const result = runCompute(trialSessionHeaderHelper, {
      state: {
        currentPage: 'TrialSessionDetail',
        trialSession: {
          judge: { userId: '98765' },
        },
      },
    });
    expect(result).toMatchObject({
      assignedJudgeIsCurrentUser: false,
      showSwitchToSessionDetail: false,
      showSwitchToWorkingCopy: false,
    });
  });

  it('shows "Switch to Session Detail" in header if viewing Working Copy and user is assigned judge', () => {
    const result = runCompute(trialSessionHeaderHelper, {
      state: {
        currentPage: 'TrialSessionWorkingCopy',
        trialSession: {
          judge: { userId: '777' },
        },
      },
    });
    expect(result).toMatchObject({
      assignedJudgeIsCurrentUser: true,
      showSwitchToSessionDetail: true,
      showSwitchToWorkingCopy: false,
    });
  });

  it('shows "Switch to Session Working Copy" in header if viewing Session Detail and user is assigned judge', () => {
    const result = runCompute(trialSessionHeaderHelper, {
      state: {
        currentPage: 'TrialSessionDetail',
        trialSession: {
          judge: { userId: '777' },
        },
      },
    });
    expect(result).toMatchObject({
      assignedJudgeIsCurrentUser: true,
      showSwitchToSessionDetail: false,
      showSwitchToWorkingCopy: true,
    });
  });
});
