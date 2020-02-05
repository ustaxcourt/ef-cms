import { User } from '../../../../shared/src/business/entities/User';
import { runCompute } from 'cerebral/test';
import { trialSessionsHelper as trialSessionsHelperComputed } from './trialSessionsHelper';
import { withAppContextDecorator } from '../../withAppContext';

let currentUser = {
  role: User.ROLES.judge,
  userId: '777',
};

const trialSessionsHelper = withAppContextDecorator(
  trialSessionsHelperComputed,
  {
    getCurrentUser: () => currentUser,
  },
);

describe('trialSessionsHelper', () => {
  it('should show the Notice Issued column for `open` sessions', () => {
    const result = runCompute(trialSessionsHelper, {
      state: {
        trialSessionsTab: {
          group: 'open',
        },
      },
    });

    expect(result.showNoticeIssued).toEqual(true);
  });

  it('should NOT show the Notice Issued column for `new` sessions', () => {
    const result = runCompute(trialSessionsHelper, {
      state: {
        trialSessionsTab: {
          group: 'new',
        },
      },
    });

    expect(result.showNoticeIssued).toEqual(false);
  });

  it('should NOT show the Notice Issued column for `closed` sessions', () => {
    const result = runCompute(trialSessionsHelper, {
      state: {
        trialSessionsTab: {
          group: 'closed',
        },
      },
    });

    expect(result.showNoticeIssued).toEqual(false);
  });

  it('should NOT show the Notice Issued column for `all` sessions', () => {
    const result = runCompute(trialSessionsHelper, {
      state: {
        trialSessionsTab: {
          group: 'all',
        },
      },
    });

    expect(result.showNoticeIssued).toEqual(false);
  });

  it('should show the Number of Cases column for `open` sessions', () => {
    const result = runCompute(trialSessionsHelper, {
      state: {
        trialSessionsTab: {
          group: 'open',
        },
      },
    });

    expect(result.showNumberOfCases).toEqual(true);
  });

  it('should NOT show the Number of Cases column for `new` sessions', () => {
    const result = runCompute(trialSessionsHelper, {
      state: {
        trialSessionsTab: {
          group: 'new',
        },
      },
    });

    expect(result.showNumberOfCases).toEqual(false);
  });

  it('should NOT show the Number of Cases column for `closed` sessions', () => {
    const result = runCompute(trialSessionsHelper, {
      state: {
        trialSessionsTab: {
          group: 'closed',
        },
      },
    });

    expect(result.showNumberOfCases).toEqual(false);
  });

  it('should NOT show the Number of Cases column for `all` sessions', () => {
    const result = runCompute(trialSessionsHelper, {
      state: {
        trialSessionsTab: {
          group: 'all',
        },
      },
    });

    expect(result.showNumberOfCases).toEqual(false);
  });

  it('should show the Session Status column for `all` sessions', () => {
    const result = runCompute(trialSessionsHelper, {
      state: {
        trialSessionsTab: {
          group: 'all',
        },
      },
    });

    expect(result.showSessionStatus).toEqual(true);
  });

  it('should NOT show the Number of Cases column for `new` sessions', () => {
    const result = runCompute(trialSessionsHelper, {
      state: {
        trialSessionsTab: {
          group: 'new',
        },
      },
    });

    expect(result.showSessionStatus).toEqual(false);
  });

  it('should NOT show the Number of Cases column for `open` sessions', () => {
    const result = runCompute(trialSessionsHelper, {
      state: {
        trialSessionsTab: {
          group: 'open',
        },
      },
    });

    expect(result.showSessionStatus).toEqual(false);
  });

  it('should NOT show the Number of Cases column for `closed` sessions', () => {
    const result = runCompute(trialSessionsHelper, {
      state: {
        trialSessionsTab: {
          group: 'closed',
        },
      },
    });

    expect(result.showSessionStatus).toEqual(false);
  });

  it('should show 5 table columns for `new` sessions', () => {
    const result = runCompute(trialSessionsHelper, {
      state: {
        trialSessionsTab: {
          group: 'new',
        },
      },
    });

    expect(result.numCols).toEqual(5);
  });

  it('should show 5 table columns for `closed` sessions', () => {
    const result = runCompute(trialSessionsHelper, {
      state: {
        trialSessionsTab: {
          group: 'closed',
        },
      },
    });

    expect(result.numCols).toEqual(5);
  });

  it('should show 7 table columns for `open` sessions', () => {
    const result = runCompute(trialSessionsHelper, {
      state: {
        trialSessionsTab: {
          group: 'open',
        },
      },
    });

    expect(result.numCols).toEqual(7);
  });

  it('should show 6 table columns for `all` sessions', () => {
    const result = runCompute(trialSessionsHelper, {
      state: {
        trialSessionsTab: {
          group: 'all',
        },
      },
    });

    expect(result.numCols).toEqual(6);
  });
});
