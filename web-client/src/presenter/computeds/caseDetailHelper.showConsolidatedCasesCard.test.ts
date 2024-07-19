import {
  adcUser,
  irsPractitionerUser,
  petitionerUser,
} from '../../../../shared/src/test/mockUsers';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { caseDetailHelper as caseDetailHelperComputed } from './caseDetailHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { mockPrivatePractitionerUser } from '@shared/test/mockAuthUsers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const caseDetailHelper = withAppContextDecorator(
  caseDetailHelperComputed,
  applicationContext,
);

let globalUser;

const getBaseState = user => {
  globalUser = user;
  return {
    permissions: getUserPermissions(user),
    user: globalUser,
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
      },
    });
    expect(result.showConsolidatedCasesCard).toEqual(true);
  });

  it('should be true when the user is a private practitioner and has the VIEW_CONSOLIDATED_CASES_CARD permission and the case is in a consolidated group', () => {
    const user = mockPrivatePractitionerUser;

    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          leadDocketNumber: '101-22F',
        },
      },
    });
    expect(result.showConsolidatedCasesCard).toEqual(true);
  });

  it('should be true when the user is an IRS practitioner and has the VIEW_CONSOLIDATED_CASES_CARD permission and the case is in a consolidated group', () => {
    const user = irsPractitionerUser;

    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          leadDocketNumber: '101-22F',
        },
      },
    });
    expect(result.showConsolidatedCasesCard).toEqual(true);
  });

  it('should be false when the user is a non practitioner/petitioner user and the case is in a consolidated group', () => {
    const user = adcUser;

    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          leadDocketNumber: '101-22F',
        },
      },
    });

    expect(result.showConsolidatedCasesCard).toEqual(false);
  });

  it('should be false when the case is not in a consolidated group and the user has VIEW_CONSOLIDATED_CASES_CARD permission', () => {
    const user = petitionerUser;

    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          leadDocketNumber: undefined,
        },
      },
    });

    expect(result.showConsolidatedCasesCard).toEqual(false);
  });
});
