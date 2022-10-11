import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { caseDetailHelper as caseDetailHelperComputed } from './caseDetailHelper';
import {
  docketClerkUser,
  irsPractitionerUser,
  petitionerUser,
  petitionsClerkUser,
  privatePractitionerUser,
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
    currentPage: 'CaseDetail',
    form: {},
    permissions: getUserPermissions(user),
  };
};

describe('showSealedCaseView', () => {
  it('should be true for a practitioner not associated with a sealed case', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(privatePractitionerUser),
        caseDetail: {
          docketEntries: [],
          isSealed: true,
          privatePractitioners: [],
        },
        screenMetadata: {
          isAssociated: false,
        },
      },
    });

    expect(result.showSealedCaseView).toEqual(true);
  });

  it('should be false for a practitioner not associated with an unsealed case', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(irsPractitionerUser),
        caseDetail: { docketEntries: [], privatePractitioners: [] },
        screenMetadata: {
          isAssociated: false,
        },
      },
    });

    expect(result.showSealedCaseView).toEqual(false);
  });

  it('should be true for a practitioner user fix this----', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          isSealed: true,
          privatePractitioners: [],
        },
        screenMetadata: {
          isAssociated: false,
        },
      },
    });

    expect(result.showSealedCaseView).toEqual(false);
  })
  it('should be true for an unassociated petitioner associated with a different case in the consolidated group', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(petitionerUser),
        caseDetail: {
          docketEntries: [],
          docketNumber: '198-23',
          isSealed: true,
          leadDocketNumber: '199-23',
          privatePractitioners: [],
        },
        screenMetadata: {
          isAssociated: false,
        },
      },
    });

    expect(result.showSealedCaseView).toEqual(true);
  });
});
