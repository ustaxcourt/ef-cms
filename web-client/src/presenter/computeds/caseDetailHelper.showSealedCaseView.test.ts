import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { caseDetailHelper as caseDetailHelperComputed } from './caseDetailHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import {
  irsPractitionerUser,
  petitionerUser,
  privatePractitionerUser,
} from '../../../../shared/src/test/mockUsers';
import { runCompute } from '@web-client/presenter/test.cerebral';
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

  it('should be true for a unassociated private practitioner user with a sealed case', () => {
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

  it('should be true for a unassociated IRS practitioner user with a sealed case', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(irsPractitionerUser),
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
