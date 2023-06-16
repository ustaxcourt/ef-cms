import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { headerHelper as headerHelperComputed } from './headerHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
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

const internal = [ROLES.petitionsClerk, ROLES.adc, ROLES.docketClerk];
const external = [
  ROLES.petitioner,
  ROLES.privatePractitioner,
  ROLES.irsPractitioner,
];

describe('headerHelper', () => {
  it('should show search in header for users other than petitioner, privatePractitioners and irsPractitioners', () => {
    let result = runCompute(headerHelper, {
      state: getBaseState({ role: ROLES.petitioner }),
    });
    expect(result.showSearchInHeader).toBeFalsy();

    result = runCompute(headerHelper, {
      state: getBaseState({ role: ROLES.petitionsClerk }),
    });
    expect(result.showSearchInHeader).toBeTruthy();

    result = runCompute(headerHelper, {
      state: getBaseState({ role: ROLES.docketClerk }),
    });
    expect(result.showSearchInHeader).toBeTruthy();

    result = runCompute(headerHelper, {
      state: getBaseState({ role: ROLES.caseServicesSupervisor }),
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

  it('should show messages for internal users without the general role', () => {
    internal.forEach(role => {
      const result = runCompute(headerHelper, {
        state: getBaseState({ role }),
      });
      expect(result.showMessages).toBeTruthy();
    });
  });

  it('showMessages should be false for case services supervisors', () => {
    const result = runCompute(headerHelper, {
      state: getBaseState({ role: ROLES.caseServicesSupervisor }),
    });
    expect(result.showMessages).toBe(false);
  });

  it('should show the messages and document qc dropdpown menus for case services supervisors', () => {
    const result = runCompute(headerHelper, {
      state: getBaseState({ role: ROLES.caseServicesSupervisor }),
    });
    expect(result.showMessagesAndQCDropDown).toBe(true);
  });

  it('should not show the messages and document qc drop down menus for non case services supervisors', () => {
    [...internal, ...external].forEach(role => {
      const result = runCompute(headerHelper, {
        state: getBaseState({ role }),
      });
      expect(result.showMessagesAndQCDropDown).toBe(false);
    });
  });

  it('should not show messages and document qc dropdown menus for internal users with the general role', () => {
    const result = runCompute(headerHelper, {
      state: getBaseState({ role: ROLES.general }),
    });
    expect(result.showMessages).toBeFalsy();
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

  it('should not show cases for irsSuperuser', () => {
    const result = runCompute(headerHelper, {
      state: getBaseState({ role: ROLES.irsSuperuser }),
    });
    expect(result.showMyCases).toBeFalsy();
  });

  it('should show search nav item for irsSuperuser', () => {
    const result = runCompute(headerHelper, {
      state: getBaseState({ role: ROLES.irsSuperuser }),
    });
    expect(result.showSearchNavItem).toBeTruthy();
  });

  it('should NOT show search nav item for privatePractitioner', () => {
    const result = runCompute(headerHelper, {
      state: getBaseState({ role: ROLES.privatePractitioner }),
    });
    expect(result.showSearchNavItem).toBeFalsy();
  });

  it('should NOT show search in header for privatePractitioners, irsPractitioners, or irsSuperuser', () => {
    let result = runCompute(headerHelper, {
      state: getBaseState({ role: ROLES.privatePractitioner }),
    });
    expect(result.showSearchInHeader).toBeFalsy();

    result = runCompute(headerHelper, {
      state: getBaseState({ role: ROLES.irsPractitioner }),
    });
    expect(result.showSearchInHeader).toBeFalsy();

    result = runCompute(headerHelper, {
      state: getBaseState({ role: ROLES.irsSuperuser }),
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

  it('should NOT show document qc for case services supervisors', () => {
    const result = runCompute(headerHelper, {
      state: getBaseState({ role: ROLES.caseServicesSupervisor }),
    });
    expect(result.showDocumentQC).toBe(false);
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
        ...getBaseState({ role: ROLES.petitionsClerk }),
        currentPage: 'Messages',
        workQueueToDisplay: {},
      },
    });
    expect(result.pageIsMessages).toBeTruthy();
  });

  it('should know when the page is My Cases', () => {
    const result = runCompute(headerHelper, {
      state: {
        ...getBaseState({ role: ROLES.petitioner }),
        currentPage: 'DashboardPetitioner',
      },
    });
    expect(result.pageIsMyCases).toBeTruthy();
  });

  it('should know when the page is Dashboard', () => {
    const result = runCompute(headerHelper, {
      state: {
        ...getBaseState({ role: ROLES.irsSuperuser }),
        currentPage: 'DashboardIrsSuperuser',
      },
    });
    expect(result.pageIsDashboard).toBeTruthy();
  });

  it('should not set pageIsMessages or pageIsDocumentQC to true if currentPage is TrialSessions', () => {
    const result = runCompute(headerHelper, {
      state: {
        ...getBaseState({ role: ROLES.petitionsClerk }),
        currentPage: 'TrialSessions',
      },
    });
    expect(result.pageIsMyCases).toBeFalsy();
    expect(result.pageIsDocumentQC).toBeFalsy();
  });

  it('should know when the page is TrialSessions', () => {
    const result = runCompute(headerHelper, {
      state: {
        ...getBaseState({ role: ROLES.petitionsClerk }),
        currentPage: 'TrialSessions',
      },
    });
    expect(result.pageIsTrialSessions).toBeTruthy();
  });

  it('should know when the page is TrialSessionDetails', () => {
    const result = runCompute(headerHelper, {
      state: {
        ...getBaseState({ role: ROLES.petitionsClerk }),
        currentPage: 'TrialSessionDetails',
      },
    });
    expect(result.pageIsTrialSessions).toBeTruthy();
  });

  it('should show the number of unread messages for a user', () => {
    const baseState = getBaseState({ role: ROLES.petitionsClerk });
    const { notifications: baseNotifications } = baseState;
    const result = runCompute(headerHelper, {
      state: {
        ...baseState,
        currentPage: 'Messages',
        notifications: {
          ...baseNotifications,
          unreadMessageCount: 2,
        },
      },
    });
    expect(result.unreadMessageCount).toBe(2);
  });

  describe('showMyAccount', () => {
    it('should be true when the user role is privatePractitioner', () => {
      const result = runCompute(headerHelper, {
        state: {
          ...getBaseState({ role: ROLES.privatePractitioner }),
          currentPage: 'DashboardPractitioner',
        },
      });

      expect(result.showMyAccount).toBeTruthy();
    });

    it('should be true when the user role is irsPractitioner', () => {
      const result = runCompute(headerHelper, {
        state: {
          ...getBaseState({ role: ROLES.irsPractitioner }),
          currentPage: 'DashboardRespondent',
        },
      });

      expect(result.showMyAccount).toBeTruthy();
    });

    it('should be true when the user role is petitioner', () => {
      const result = runCompute(headerHelper, {
        state: {
          ...getBaseState({ role: ROLES.petitioner }),
          currentPage: 'DashboardPetitioner',
        },
      });

      expect(result.showMyAccount).toBeTruthy();
    });

    it('should be false when the user role is not private or irs practitioner', () => {
      const result = runCompute(headerHelper, {
        state: {
          ...getBaseState({ role: ROLES.petitionsClerk }),
          currentPage: 'Messages',
        },
      });

      expect(result.showMyAccount).toBeFalsy();
    });
  });

  describe('showVerifyEmailWarningNotification', () => {
    it('should be true when the user has a pending email', () => {
      const result = runCompute(headerHelper, {
        state: {
          ...getBaseState({
            pendingEmail: 'test@example.com',
            role: ROLES.irsPractitioner,
          }),
          currentPage: 'DashboardRespondent',
        },
      });

      expect(result.showVerifyEmailWarningNotification).toBeTruthy();
    });

    it('should be false when the user does not have a pending email', () => {
      const result = runCompute(headerHelper, {
        state: {
          ...getBaseState({
            pendingEmail: undefined,
            role: ROLES.irsPractitioner,
          }),
          currentPage: 'DashboardRespondent',
        },
      });

      expect(result.showVerifyEmailWarningNotification).toBeFalsy();
    });
  });
});
