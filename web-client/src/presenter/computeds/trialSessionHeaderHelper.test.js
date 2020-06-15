import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { User } from '../../../../shared/src/business/entities/User';
import { runCompute } from 'cerebral/test';
import { trialSessionHeaderHelper as trialSessionHeaderHelperComputed } from './trialSessionHeaderHelper';
import { withAppContextDecorator } from '../../withAppContext';

const CHAMBERS_USER_ID = 'c7602d72-050c-46ae-bfc8-57052a101fee';
const JUDGE_USER_ID = '8979ce01-bb0f-43ec-acee-fb3c0e967f0d';
const TRIAL_CLERK_USER_ID = '6a2bc4a9-6cd0-44bb-92e0-b7cd7404fa0d';

let currentUser;

const trialSessionHeaderHelper = withAppContextDecorator(
  trialSessionHeaderHelperComputed,
  {
    getConstants: () => ({
      USER_ROLES: ROLES,
    }),
    getCurrentUser: () => currentUser,
    getUtilities: () => ({
      formattedTrialSessionDetails: ({ trialSession }) => ({
        ...trialSession,
        formattedJudge:
          (trialSession.judge && trialSession.judge.name) || 'Not assigned',
      }),
    }),
  },
);

const chambersUser = new User({
  name: 'Trial Judge Chambers',
  role: ROLES.chambers,
  userId: CHAMBERS_USER_ID,
});

const judgeUser = new User({
  name: 'Trial Judge',
  role: ROLES.judge,
  userId: JUDGE_USER_ID,
});

const trialClerkUser = new User({
  name: 'Trial Clerk',
  role: ROLES.trialClerk,
  userId: TRIAL_CLERK_USER_ID,
});

const baseState = {
  constants: { USER_ROLES: ROLES },
  judgeUser: { role: ROLES.judge, userId: JUDGE_USER_ID },
};

describe('trial session helper computed', () => {
  beforeEach(() => {
    currentUser = judgeUser;
  });

  it('computes defaults with no data', () => {
    const result = runCompute(trialSessionHeaderHelper, {});
    expect(result).toBeDefined();
  });

  it('does not show switch-links in header if not the assigned judge or trial clerk', () => {
    const result = runCompute(trialSessionHeaderHelper, {
      state: {
        ...baseState,
        currentPage: 'TrialSessionDetail',
        trialSession: {
          judge: { userId: '98765' },
        },
      },
    });
    expect(result).toMatchObject({
      showSwitchToSessionDetail: false,
      showSwitchToWorkingCopy: false,
    });
  });

  it('shows "Switch to Session Detail" in header if viewing Working Copy and user is assigned judge', () => {
    const result = runCompute(trialSessionHeaderHelper, {
      state: {
        ...baseState,
        currentPage: 'TrialSessionWorkingCopy',
        trialSession: {
          judge: { userId: JUDGE_USER_ID },
        },
      },
    });
    expect(result).toMatchObject({
      showSwitchToSessionDetail: true,
      showSwitchToWorkingCopy: false,
    });
  });

  it('shows "Switch to Session Working Copy" in header if viewing Session Detail and user is assigned judge', () => {
    const result = runCompute(trialSessionHeaderHelper, {
      state: {
        ...baseState,
        currentPage: 'TrialSessionDetail',
        trialSession: {
          judge: { userId: JUDGE_USER_ID },
        },
      },
    });
    expect(result).toMatchObject({
      showSwitchToSessionDetail: false,
      showSwitchToWorkingCopy: true,
    });
  });

  it('shows "Switch to Session Detail" in header if viewing Working Copy and user is assigned trial clerk', () => {
    currentUser = trialClerkUser;

    const result = runCompute(trialSessionHeaderHelper, {
      state: {
        ...baseState,
        currentPage: 'TrialSessionWorkingCopy',
        trialSession: {
          judge: { userId: 'b721e8d8-2e9b-4e69-89eb-d7f3e8a2ba4c' },
          trialClerk: { userId: TRIAL_CLERK_USER_ID },
        },
      },
    });
    expect(result).toMatchObject({
      showSwitchToSessionDetail: true,
      showSwitchToWorkingCopy: false,
    });
  });

  it('shows "Switch to Session Working Copy" in header if viewing Session Detail and user is assigned trial clerk', () => {
    currentUser = trialClerkUser;

    const result = runCompute(trialSessionHeaderHelper, {
      state: {
        ...baseState,
        currentPage: 'TrialSessionDetail',
        trialSession: {
          judge: { userId: 'b721e8d8-2e9b-4e69-89eb-d7f3e8a2ba4c' },
          trialClerk: { userId: TRIAL_CLERK_USER_ID },
        },
      },
    });
    expect(result).toMatchObject({
      showSwitchToSessionDetail: false,
      showSwitchToWorkingCopy: true,
    });
  });

  it('shows nameToDisplay as the assigned judge name when the current user is the assigned judge user', () => {
    const result = runCompute(trialSessionHeaderHelper, {
      state: {
        ...baseState,
        currentPage: 'TrialSessionDetail',
        trialSession: {
          judge: judgeUser,
        },
      },
    });
    expect(result).toMatchObject({
      nameToDisplay: 'Trial Judge',
    });
  });

  it("shows nameToDisplay as the assigned judge name when the current user is the assigned judge's chambers user", () => {
    currentUser = chambersUser;
    const result = runCompute(trialSessionHeaderHelper, {
      state: {
        ...baseState,
        currentPage: 'TrialSessionDetail',
        trialSession: {
          judge: judgeUser, // current user is "Trial Judge"
        },
      },
    });
    expect(result).toMatchObject({
      nameToDisplay: 'Trial Judge',
    });
  });

  it('shows nameToDisplay as the assigned trial clerk name when the current user is the assigned trial clerk user', () => {
    currentUser = trialClerkUser;
    const result = runCompute(trialSessionHeaderHelper, {
      state: {
        ...baseState,
        currentPage: 'TrialSessionDetail',
        trialSession: {
          trialClerk: trialClerkUser, // current user is "Trial Judge"
        },
      },
    });
    expect(result).toMatchObject({
      nameToDisplay: 'Trial Clerk',
    });
  });
});
