import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  caseServicesSupervisorUser,
  colvinsChambersUser,
  docketClerkUser,
  judgeUser,
  petitionsClerkUser,
} from '@shared/test/mockUsers';
import { getUserPermissions } from '@web-client/authorization/getUserPermissions';
import { reportMenuHelper as reportMenuHeaderComputed } from './reportMenuHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../src/withAppContext';

describe('reportMenuHelper', () => {
  const reportMenuHelper = withAppContextDecorator(
    reportMenuHeaderComputed,
    applicationContext,
  );

  const getBaseState = user => {
    return {
      currentPage: 'CaseDetailInternal',
      permissions: getUserPermissions(user),
      user,
    };
  };

  describe('showActivityReport', () => {
    it('should be true when the current user is a judge user', () => {
      const result = runCompute(reportMenuHelper, {
        state: getBaseState(judgeUser),
      });

      expect(result.showActivityReport).toBeTruthy();
    });

    it('should be true when the current user is a chambers user', () => {
      const result = runCompute(reportMenuHelper, {
        state: getBaseState(colvinsChambersUser),
      });

      expect(result.showActivityReport).toBeTruthy();
    });

    it('should be false when the current user is NOT a judge or chambers user', () => {
      const result = runCompute(reportMenuHelper, {
        state: getBaseState(petitionsClerkUser),
      });

      expect(result.showActivityReport).toBeFalsy();
    });

    it('should be false when permissions is undefined because the user has logged out', () => {
      const result = runCompute(reportMenuHelper, {
        state: {
          ...getBaseState(undefined),
          permissions: undefined,
        },
      });

      expect(result.showActivityReport).toBeFalsy();
    });
  });

  describe('pageIsReports', () => {
    it('should show a border under the Reports tab to indicate it is the active tab when the current page is Case Deadlines Report', () => {
      const result = runCompute(reportMenuHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          currentPage: 'CaseDeadlines',
        },
      });

      expect(result.pageIsReports).toBeTruthy();
    });

    it('should show a border under the Reports tab to indicate it is the active tab when the current page is the Blocked Cases Report', () => {
      const result = runCompute(reportMenuHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          currentPage: 'BlockedCasesReport',
        },
      });

      expect(result.pageIsReports).toBeTruthy();
    });

    it('should show a border under the Reports tab when the current page is the Docket Clerk Report', () => {
      const result = runCompute(reportMenuHelper, {
        state: {
          ...getBaseState(caseServicesSupervisorUser),
          currentPage: 'DocketClerkReport',
        },
      });

      expect(result.pageIsReports).toBeTruthy();
    });

    it('should NOT show the Reports border on an unrelated page', () => {
      const result = runCompute(reportMenuHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          currentPage: 'CaseDetailInternal',
        },
      });

      expect(result.pageIsReports).toBeFalsy();
    });
  });

  describe('showDocketClerkReport', () => {
    it('should be true when the current user is a caseServicesSupervisor', () => {
      const result = runCompute(reportMenuHelper, {
        state: getBaseState(caseServicesSupervisorUser),
      });

      expect(result.showDocketClerkReport).toBeTruthy();
    });

    it('should be false when the current user is a docketClerk', () => {
      const result = runCompute(reportMenuHelper, {
        state: getBaseState(docketClerkUser),
      });

      expect(result.showDocketClerkReport).toBeFalsy();
    });

    it('should be false when the current user is a petitionsClerk', () => {
      const result = runCompute(reportMenuHelper, {
        state: getBaseState(petitionsClerkUser),
      });

      expect(result.showDocketClerkReport).toBeFalsy();
    });

    it('should be false when permissions is undefined because the user has logged out', () => {
      const result = runCompute(reportMenuHelper, {
        state: {
          ...getBaseState(undefined),
          permissions: undefined,
        },
      });

      expect(result.showDocketClerkReport).toBeFalsy();
    });
  });
});
