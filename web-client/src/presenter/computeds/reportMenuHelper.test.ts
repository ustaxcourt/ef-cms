import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  colvinsChambersUser,
  judgeUser,
  petitionsClerkUser,
} from '@shared/test/mockUsers';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { reportMenuHelper as reportMenuHeaderComputed } from './reportMenuHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../src/withAppContext';

describe('reportMenuHelper', () => {
  const reportMenuHelper = withAppContextDecorator(
    reportMenuHeaderComputed,
    applicationContext,
  );

  const getBaseState = user => {
    applicationContext.getCurrentUser.mockReturnValue(user);
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
  });
});
