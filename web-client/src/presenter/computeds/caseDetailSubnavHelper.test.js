import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
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
      role: ROLES.petitionsClerk,
      userId: '123',
    };
    const result = runCompute(caseDetailSubnavHelper, {
      state: {
        ...getBaseState(user),
      },
    });
    expect(result.showCaseInformationTab).toBeTruthy();
    expect(result.showTrackedItemsTab).toBeTruthy();
    expect(result.showDraftsTab).toBeTruthy();
    expect(result.showMessagesTab).toBeTruthy();
    expect(result.showCorrespondenceTab).toBeTruthy();
    expect(result.showNotesTab).toBeTruthy();
  });

  it('should not show internal-only tabs if user is external', () => {
    const user = {
      role: ROLES.petitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailSubnavHelper, {
      state: {
        ...getBaseState(user),
      },
    });
    expect(result.showTrackedItemsTab).toBeFalsy();
    expect(result.showDraftsTab).toBeFalsy();
    expect(result.showMessagesTab).toBeFalsy();
    expect(result.showCorrespondenceTab).toBeFalsy();
    expect(result.showNotesTab).toBeFalsy();
  });

  it('should show case information tab if user is external and associated with the case', () => {
    const user = {
      role: ROLES.petitioner,
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
      role: ROLES.irsPractitioner,
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
