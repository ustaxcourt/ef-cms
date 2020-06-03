import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { User } from '../../../../shared/src/business/entities/User';
import { applicationContext } from '../../applicationContext';
import { caseDetailHeaderHelper as caseDetailHeaderHelperComputed } from './caseDetailHeaderHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const caseDetailHeaderHelper = withAppContextDecorator(
  caseDetailHeaderHelperComputed,
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

describe('caseDetailHeaderHelper', () => {
  it('should set showEditCaseButton to true if the user has UPDATE_CASE_CONTENT permission', () => {
    const user = {
      role: User.ROLES.docketClerk,
      userId: 'docketClerk',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { status: Case.STATUS_TYPES.new },
      },
    });
    expect(result.showEditCaseButton).toEqual(true);
  });

  it('should set showEditCaseButton to false if the user does not have UPDATE_CASE_CONTENT permission', () => {
    const user = {
      role: User.ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { status: Case.STATUS_TYPES.new },
      },
    });
    expect(result.showEditCaseButton).toEqual(false);
  });

  it('should set showFileFirstDocumentButton and showRequestAccessToCaseButton to false if user role is respondent and the respondent is associated with the case', () => {
    const user = {
      role: User.ROLES.irsPractitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { irsPractitioners: [{ userId: '789' }] },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: true,
        },
      },
    });
    expect(result.showFileFirstDocumentButton).toEqual(false);
    expect(result.showRequestAccessToCaseButton).toEqual(false);
  });

  it('should set showFileFirstDocumentButton and showRequestAccessToCaseButton to false if user role is respondent and the respondent is not associated with the case but the case is sealed', () => {
    const user = {
      role: User.ROLES.irsPractitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          irsPractitioners: [{ userId: '789' }],
          isSealed: true,
        },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: false,
        },
      },
    });
    expect(result.showFileFirstDocumentButton).toEqual(false);
    expect(result.showRequestAccessToCaseButton).toEqual(false);
  });

  it('should set showRequestAccessToCaseButton to true if user role is respondent and the respondent is not associated with the case', () => {
    const user = {
      role: User.ROLES.irsPractitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { irsPractitioners: [{ userId: '123' }] },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: false,
        },
      },
    });
    expect(result.showFileFirstDocumentButton).toEqual(false);
    expect(result.showRequestAccessToCaseButton).toEqual(true);
  });

  it('should set showFileFirstDocumentButton to true if user role is respondent and there is no respondent associated with the case', () => {
    const user = {
      role: User.ROLES.irsPractitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: false,
        },
      },
    });
    expect(result.showFileFirstDocumentButton).toEqual(true);
    expect(result.showRequestAccessToCaseButton).toEqual(false);
  });

  it('should set showPendingAccessToCaseButton to true if user role is practitioner and case is not owned by user but has pending request', () => {
    const user = {
      role: User.ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: false,
          pendingAssociation: true,
        },
      },
    });
    expect(result.showPendingAccessToCaseButton).toEqual(true);
  });

  it('should set showRequestAccessToCaseButton to true if user role is practitioner and case is not owned by user', () => {
    const user = {
      role: User.ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: false,
        },
      },
    });
    expect(result.showRequestAccessToCaseButton).toEqual(true);
  });

  it('should set showRequestAccessToCaseButton to false when the current page is FilePetitionSuccess', () => {
    const user = {
      role: User.ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        currentPage: 'FilePetitionSuccess',
        form: {},
        screenMetadata: {
          isAssociated: false,
        },
      },
    });
    expect(result.showRequestAccessToCaseButton).toEqual(false);
  });

  it('should set showRequestAccessToCaseButton to false if user role is practitioner and case is not owned by user and the case is sealed', () => {
    const user = {
      role: User.ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { isSealed: true },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: false,
        },
      },
    });
    expect(result.showRequestAccessToCaseButton).toEqual(false);
  });

  it('should set showRequestAccessToCaseButton to false if user role is practitioner and case is owned by user', () => {
    const user = {
      role: User.ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { privatePractitioners: [{ userId: '123' }] },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: true,
        },
      },
    });
    expect(result.showRequestAccessToCaseButton).toEqual(false);
  });

  it('should set showRequestAccessToCaseButton to false if user role is petitioner and user is not associated with the case', () => {
    const user = {
      role: User.ROLES.petitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: false,
        },
      },
    });
    expect(result.showRequestAccessToCaseButton).toEqual(false);
  });

  it('should show the consolidated case icon if the case is associated with a lead case', async () => {
    const user = {
      role: User.ROLES.docketClerk,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          leadCaseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: false,
        },
      },
    });

    expect(result.showConsolidatedCaseIcon).toEqual(true);
  });

  it('should NOT show the consolidated case icon if the case is NOT associated with a lead case', async () => {
    const user = {
      role: User.ROLES.docketClerk,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          leadCaseId: '',
        },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: false,
        },
      },
    });

    expect(result.showConsolidatedCaseIcon).toEqual(false);
  });

  it('should show the case detail header menu and add docket entry and create order buttons if current page is CaseDetailInternal and user role is docketclerk', () => {
    const user = {
      role: User.ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        currentPage: 'CaseDetailInternal',
        form: {},
      },
    });
    expect(result.showCaseDetailHeaderMenu).toEqual(true);
    expect(result.showAddDocketEntryButton).toEqual(true);
    expect(result.showCreateOrderButton).toEqual(true);
  });

  it('should show the Sealed Case banner if the case is sealed', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        caseDetail: { isSealed: true },
        currentPage: 'CaseDetail',
        form: {},
        permissions: {},
      },
    });
    expect(result.showSealedCaseBanner).toEqual(true);
  });

  it('should show file document button if user has FILE_EXTERNAL_DOCUMENT permission and the user is associated with the case', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
        permissions: {
          FILE_EXTERNAL_DOCUMENT: true,
        },
        screenMetadata: { isAssociated: true },
      },
    });
    expect(result.showFileDocumentButton).toEqual(true);
  });

  it('should not show file document button if user does not have FILE_EXTERNAL_DOCUMENT permission', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
        permissions: {
          FILE_EXTERNAL_DOCUMENT: false,
        },
        screenMetadata: { isAssociated: true },
      },
    });
    expect(result.showFileDocumentButton).toEqual(false);
  });

  it('should not show file document button if user has FILE_EXTERNAL_DOCUMENT permission but the user is not associated with the case', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
        permissions: {
          FILE_EXTERNAL_DOCUMENT: true,
        },
        screenMetadata: { isAssociated: false },
      },
    });
    expect(result.showFileDocumentButton).toEqual(false);
  });

  it('should show the Upload PDF button in the action menu if the user is a court user', () => {
    const user = {
      role: User.ROLES.docketClerk,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
        permissions: {
          FILE_EXTERNAL_DOCUMENT: true,
        },
        screenMetadata: { isAssociated: false },
      },
    });

    expect(result.showUploadCourtIssuedDocumentButton).toEqual(true);
  });

  it('should NOT show the Upload PDF button in the action menu if the user is not a court user', () => {
    const user = {
      role: User.ROLES.petitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
        permissions: {
          FILE_EXTERNAL_DOCUMENT: true,
        },
        screenMetadata: { isAssociated: false },
      },
    });

    expect(result.showUploadCourtIssuedDocumentButton).toEqual(false);
  });
});
