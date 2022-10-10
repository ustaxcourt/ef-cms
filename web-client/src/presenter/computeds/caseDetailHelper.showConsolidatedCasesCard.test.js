import {
  adcUser,
  docketClerkUser,
  petitionerUser,
} from '../../../../shared/src/test/mockUsers';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { caseDetailHelper as caseDetailHelperComputed } from './caseDetailHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const caseDetailHelper = withAppContextDecorator(caseDetailHelperComputed, {
  ...applicationContext,
  getCurrentUser: () => {
    return globalUser;
  },
});

let globalUser;

const getBaseState = user => {
  globalUser = user;
  return {
    currentPage: 'CaseDetailInternal',
    form: {},
    permissions: getUserPermissions(user),
  };
};

describe('showConsolidatedCasesCard', () => {
  it('should be true when the user has VIEW_CONSOLIDATED_CASES_CARD permission and the case is in a consolidated group', () => {
    const user = petitionerUser;

    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          leadDocketNumber: '101-22F',
        },
        permissions: { VIEW_CONSOLIDATED_CASES_CARD: true },
      },
    });
    expect(result.showConsolidatedCasesCard).toEqual(true);
  });

  it.skip('should be false when the user does not have TRACKED_ITEMS permission', () => {
    const user = adcUser;

    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
        },
        permission: { TRACKED_ITEMS: false },
      },
    });

    expect(result.showConsolidatedCasesCard).toEqual(false);
  });
});
