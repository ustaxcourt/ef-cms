import { User } from '../../../../shared/src/business/entities/User';
import { applicationContext } from '../../applicationContext';
import { caseDetailSubnavHelper as caseDetailSubnavHelperComputed } from './caseDetailSubnavHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const caseDetailSubnavHelper = withAppContextDecorator(
  caseDetailSubnavHelperComputed,
  {
    ...applicationContext,
    getCurrentUser: () => {
      return globalUser;
    },
  },
);

let globalUser;

const getBaseState = user => {
  globalUser = user;
  return {
    permissions: getUserPermissions(user),
  };
};

describe('caseDetailSubnavHelper', () => {
  it('should show internal-only tabs if user is internal', () => {
    const user = {
      role: User.ROLES.petitionsClerk,
      userId: '123',
    };
    const result = runCompute(caseDetailSubnavHelper, {
      state: {
        ...getBaseState(user),
      },
    });
    expect(result.showCaseInformationTab).toBeTruthy();
    expect(result.showDeadlinesTab).toBeTruthy();
    expect(result.showInProgressTab).toBeTruthy();
    expect(result.showNotesTab).toBeTruthy();
  });

  it('should not show internal-only tabs if user is external', () => {
    const user = {
      role: User.ROLES.petitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailSubnavHelper, {
      state: {
        ...getBaseState(user),
      },
    });
    expect(result.showDeadlinesTab).toBeFalsy();
    expect(result.showInProgressTab).toBeFalsy();
    expect(result.showNotesTab).toBeFalsy();
  });

  it('should show case information tab if user is external and associated with the case', () => {
    const user = {
      role: User.ROLES.petitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailSubnavHelper, {
      state: {
        ...getBaseState(user),
        screenMetadata: {
          isAssociated: true,
        },
      },
    });
    expect(result.showCaseInformationTab).toBeTruthy();
  });

  it('should not show case information tab if user is external and not associated with the case', () => {
    const user = {
      role: User.ROLES.respondent,
      userId: '123',
    };
    const result = runCompute(caseDetailSubnavHelper, {
      state: {
        ...getBaseState(user),
        screenMetadata: {
          isAssociated: false,
        },
      },
    });
    expect(result.showCaseInformationTab).toBeFalsy();
  });
});
