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

  const nonPractitionerUsers = [
    docketClerkUser,
    petitionerUser,
    petitionsClerkUser,
  ];

  nonPractitionerUsers.forEach(user => {
    it(`should be false for a non practitioner ${user} user`, () => {
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
    });
  });
});
