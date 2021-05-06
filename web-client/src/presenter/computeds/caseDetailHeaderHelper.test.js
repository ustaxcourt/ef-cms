import {
  CASE_STATUS_TYPES,
  ROLES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { caseDetailHeaderHelper as caseDetailHeaderHelperComputed } from './caseDetailHeaderHelper';
import { getContactPrimary } from '../../../../shared/src/business/entities/cases/Case';
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
      role: ROLES.docketClerk,
      userId: 'docketClerk',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          petitioners: [],
          status: CASE_STATUS_TYPES.new,
        },
      },
    });
    expect(result.showEditCaseButton).toEqual(true);
  });

  it('should set showEditCaseButton to false if the user does not have UPDATE_CASE_CONTENT permission', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          petitioners: [],
          status: CASE_STATUS_TYPES.new,
        },
      },
    });
    expect(result.showEditCaseButton).toEqual(false);
  });

  it('should set showExternalButtons false if user is an internal user', () => {
    const user = {
      role: ROLES.petitionsClerk,
      userId: '789',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [], petitioners: [] },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: true,
        },
      },
    });
    expect(result.showExternalButtons).toEqual(false);
  });

  it('should set showExternalButtons false if user is an external user and the case does not have any served docket entries', () => {
    const user = {
      role: ROLES.petitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [{ documentType: 'Petition' }],
          petitioners: [],
        },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: true,
        },
      },
    });
    expect(result.showExternalButtons).toEqual(false);
  });

  it('should set showExternalButtons true if user is an external user and the case has served docket entries', () => {
    const user = {
      role: ROLES.petitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [
            { documentType: 'Petition', servedAt: '2019-03-01T21:40:46.415Z' },
          ],
          petitioners: [],
        },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: true,
        },
      },
    });
    expect(result.showExternalButtons).toEqual(true);
  });

  it('should set showExternalButtons true if user is an external user and the case has isLegacyServed docket entries', () => {
    const user = {
      role: ROLES.petitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [{ documentType: 'Answer', isLegacyServed: true }],
          petitioners: [],
        },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: true,
        },
      },
    });
    expect(result.showExternalButtons).toEqual(true);
  });

  it('should set showFileFirstDocumentButton and showRequestAccessToCaseButton to false if user role is respondent and the respondent is associated with the case', () => {
    const user = {
      role: ROLES.irsPractitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          irsPractitioners: [{ userId: '789' }],
          petitioners: [],
        },
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
      role: ROLES.irsPractitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          hasIrsPractitioner: true,
          isSealed: true,
          petitioners: [],
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
      role: ROLES.irsPractitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          hasIrsPractitioner: true,
          petitioners: [],
        },
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
      role: ROLES.irsPractitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          hasIrsPractitioner: false,
          petitioners: [],
        },
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
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [], petitioners: [] },
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
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [], petitioners: [] },
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
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [], petitioners: [] },
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
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [], isSealed: true, petitioners: [] },
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
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          petitioners: [],
          privatePractitioners: [{ userId: '123' }],
        },
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
      role: ROLES.petitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [], petitioners: [] },
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
      role: ROLES.docketClerk,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          leadDocketNumber: '101-20',
          petitioners: [],
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
      role: ROLES.docketClerk,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          leadDocketNumber: '',
          petitioners: [],
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
      role: ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [], petitioners: [] },
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
        caseDetail: { docketEntries: [], isSealed: true, petitioners: [] },
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
        caseDetail: { docketEntries: [], petitioners: [] },
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
        caseDetail: { docketEntries: [], petitioners: [] },
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
        caseDetail: { docketEntries: [], petitioners: [] },
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
      role: ROLES.docketClerk,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [], petitioners: [] },
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
      role: ROLES.petitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [], petitioners: [] },
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

  it('should set showNewTabLink to true if user is an internal user', () => {
    const user = {
      role: ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [], petitioners: [] },
        currentPage: 'CaseDetailInternal',
        form: {},
      },
    });
    expect(result.showNewTabLink).toBe(true);
  });

  it('should set showNewTabLink to false if user is an external user', () => {
    const user = {
      role: ROLES.petitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [], petitioners: [] },
        currentPage: 'CaseDetailInternal',
        form: {},
      },
    });
    expect(result.showNewTabLink).toBe(false);
  });

  it('should set showCreateMessageButton to false when the user role is General', () => {
    const user = {
      role: ROLES.general,
      userId: 'e7c05404-cfd3-45e2-bc6b-c8aeb8ed869e',
    };

    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [], petitioners: [] },
        currentPage: 'CaseDetailInternal',
        form: {},
      },
    });

    expect(result.showCreateMessageButton).toBe(false);
  });

  it('should set showCreateMessageButton to true when the user role is NOT General', () => {
    const user = {
      role: ROLES.petitionsClerk,
      userId: '08f9464a-6eb4-4d58-bf38-5276fe9a5911',
    };

    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [], petitioners: [] },
        currentPage: 'CaseDetailInternal',
        form: {},
      },
    });

    expect(result.showCreateMessageButton).toBe(true);
  });

  describe('showRepresented', () => {
    it('is true when at least one party on the case is represented and the current user is an internal user', () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '08f9464a-6eb4-4d58-bf38-5276fe9a5911',
      };

      const representedUserId = '79c404b8-7ddc-4c48-974c-40b153c25f9e';

      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [],
            petitioners: [
              {
                ...getContactPrimary(MOCK_CASE),
                contactId: representedUserId,
              },
            ],
            privatePractitioners: [{ representing: [representedUserId] }],
          },
          currentPage: 'CaseDetailInternal',
          form: {},
        },
      });

      expect(result.showRepresented).toBe(true);
    });

    it('is false when no petitioner on the case is represented and the current user is an internal user', () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '08f9464a-6eb4-4d58-bf38-5276fe9a5911',
      };

      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [],
            petitioners: [
              {
                ...getContactPrimary(MOCK_CASE),
                contactId: '4dcf51d8-c764-470d-a99c-6bf41a9f7b55',
              },
            ],
            privatePractitioners: [
              { representing: ['b02df1f5-f5ad-4bf2-9be1-105f818a2529'] },
            ],
          },
          currentPage: 'CaseDetailInternal',
          form: {},
        },
      });

      expect(result.showRepresented).toBe(false);
    });

    it('is false when the logged in user is an external user', () => {
      const user = {
        role: ROLES.petitioner,
        userId: 'b310a93a-ea84-4205-9f81-2ab40c00be95',
      };

      const representedUserId = '79c404b8-7ddc-4c48-974c-40b153c25f9e';

      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [],
            petitioners: [
              {
                ...getContactPrimary(MOCK_CASE),
                contactId: representedUserId,
              },
            ],
            privatePractitioners: [{ representing: [representedUserId] }],
          },
          currentPage: 'CaseDetailInternal',
          form: {},
        },
      });

      expect(result.showRepresented).toBe(false);
    });
  });
});
