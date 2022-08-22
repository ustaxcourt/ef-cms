import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { caseDetailHelper as caseDetailHelperComputed } from './caseDetailHelper';
import {
  docketClerkUser,
  petitionsClerkUser,
} from '../../../../shared/src/test/mockUsers';
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

describe('hasTrackedItemsPermission', () => {
  it('should be true when the user has TRACKED_ITEMS permission', () => {
    const user = docketClerkUser;

    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          privatePractitioners: [{ userId: '789' }],
        },
        permission: { TRACKED_ITEMS: true },
      },
    });
    expect(result.hasTrackedItemsPermission).toEqual(true);
  });

  it('should be false when the user does not have TRACKED_ITEMS permission', () => {
    const user = petitionsClerkUser;

    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          privatePractitioners: [{ userId: '789' }],
        },
        permission: { TRACKED_ITEMS: false },
      },
    });
    expect(result.hasTrackedItemsPermission).toEqual(false);
  });
});
