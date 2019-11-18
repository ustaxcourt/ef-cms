import { User } from '../../../../shared/src/business/entities/User';
import { applicationContext } from '../../applicationContext';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { headerHelper as headerHelperComputed } from './headerHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../src/withAppContext';

const headerHelper = withAppContextDecorator(
  headerHelperComputed,
  applicationContext,
);

const getBaseState = user => {
  applicationContext.getCurrentUser = () => user;
  return {
    notifications: {
      unreadCount: 0,
    },
    permissions: getUserPermissions(user),
  };
};

const internal = [
  User.ROLES.petitionsClerk,
  User.ROLES.adc,
  User.ROLES.docketClerk,
];
const external = [
  User.ROLES.petitioner,
  User.ROLES.practitioner,
  User.ROLES.respondent,
];

describe('headerHelper', () => {
  it('should show search in header for users other than practitioners and respondents', () => {
    let result = runCompute(headerHelper, {
      state: getBaseState({ role: User.ROLES.petitioner }),
    });
    expect(result.showSearchInHeader).toBeTruthy();

    result = runCompute(headerHelper, {
      state: getBaseState({ role: User.ROLES.petitionsClerk }),
    });
    expect(result.showSearchInHeader).toBeTruthy();

    result = runCompute(headerHelper, {
      state: getBaseState({ role: User.ROLES.docketClerk }),
    });
    expect(result.showSearchInHeader).toBeTruthy();
  });

  it('should show document qc for internal users', () => {
    internal.forEach(role => {
      const result = runCompute(headerHelper, {
        state: getBaseState({ role }),
      });
      expect(result.showDocumentQC).toBeTruthy();
    });
  });
  it('should show messages for internal users', () => {
    internal.forEach(role => {
      const result = runCompute(headerHelper, {
        state: getBaseState({ role }),
      });
      expect(result.showMessages).toBeTruthy();
    });
  });
  it('should show trial sessions for internal users', () => {
    internal.forEach(role => {
      const result = runCompute(headerHelper, {
        state: getBaseState({ role }),
      });
      expect(result.showTrialSessions).toBeTruthy();
    });
  });
  it('should show cases for external users', () => {
    external.forEach(role => {
      const result = runCompute(headerHelper, {
        state: getBaseState({ role }),
      });
      expect(result.showMyCases).toBeTruthy();
    });
  });
  it('should NOT show search in header for practitioners or respondents', () => {
    let result = runCompute(headerHelper, {
      state: getBaseState({ role: User.ROLES.practitioner }),
    });
    expect(result.showSearchInHeader).toBeFalsy();

    result = runCompute(headerHelper, {
      state: getBaseState({ role: User.ROLES.respondent }),
    });
    expect(result.showSearchInHeader).toBeFalsy();
  });
  it('should NOT show document qc for external users', () => {
    external.forEach(role => {
      const result = runCompute(headerHelper, {
        state: getBaseState({ role }),
      });
      expect(result.showDocumentQC).toBeFalsy();
    });
  });
  it('should NOT show trial sessions for external users', () => {
    external.forEach(role => {
      const result = runCompute(headerHelper, {
        state: getBaseState({ role }),
      });
      expect(result.showTrialSessions).toBeFalsy();
    });
  });
  it('should NOT show messages for external users', () => {
    external.forEach(role => {
      const result = runCompute(headerHelper, {
        state: getBaseState({ role }),
      });
      expect(result.showMessages).toBeFalsy();
    });
  });
  it('should NOT show cases for internal users', () => {
    internal.forEach(role => {
      const result = runCompute(headerHelper, {
        state: getBaseState({ role }),
      });
      expect(result.showMyCases).toBeFalsy();
    });
  });
  it('should know when the page is Messages', () => {
    const result = runCompute(headerHelper, {
      state: {
        ...getBaseState({ role: User.ROLES.petitionsClerk }),
        currentPage: 'Messages',
        workQueueToDisplay: {
          workQueueIsInternal: true,
        },
      },
    });
    expect(result.pageIsMessages).toBeTruthy();
  });
  it('should know when the page is My Cases', () => {
    const result = runCompute(headerHelper, {
      state: {
        ...getBaseState({ role: User.ROLES.petitioner }),
        currentPage: 'DashboardPetitioner',
      },
    });
    expect(result.pageIsMyCases).toBeTruthy();
  });
  it('should not set pageIsMessages or pageIsDocumentQC to true if currentPage is TrialSessions', () => {
    const result = runCompute(headerHelper, {
      state: {
        ...getBaseState({ role: User.ROLES.petitionsClerk }),
        currentPage: 'TrialSessions',
      },
    });
    expect(result.pageIsMyCases).toBeFalsy();
    expect(result.pageIsDocumentQC).toBeFalsy();
  });
  it('should know when the page is TrialSessions', () => {
    const result = runCompute(headerHelper, {
      state: {
        ...getBaseState({ role: User.ROLES.petitionsClerk }),
        currentPage: 'TrialSessions',
      },
    });
    expect(result.pageIsTrialSessions).toBeTruthy();
  });
  it('should know when the page is TrialSessionDetails', () => {
    const result = runCompute(headerHelper, {
      state: {
        ...getBaseState({ role: User.ROLES.petitionsClerk }),
        currentPage: 'TrialSessionDetails',
      },
    });
    expect(result.pageIsTrialSessions).toBeTruthy();
  });

  it('should show border under Reports tab when page is CaseDeadlines', () => {
    const result = runCompute(headerHelper, {
      state: {
        ...getBaseState({ role: User.ROLES.petitionsClerk }),
        currentPage: 'CaseDeadlines',
      },
    });
    expect(result.pageIsReports).toBeTruthy();
  });

  it('should show border under Reports tab when page is BlockedCasesReport', () => {
    const result = runCompute(headerHelper, {
      state: {
        ...getBaseState({ role: User.ROLES.petitionsClerk }),
        currentPage: 'BlockedCasesReport',
      },
    });
    expect(result.pageIsReports).toBeTruthy();
  });
});
