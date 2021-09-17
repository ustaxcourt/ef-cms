import { CASE_STATUS_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { caseDetailHeaderHelper as caseDetailHeaderHelperComputed } from './caseDetailHeaderHelper';
import {
  docketClerkUser,
  generalUser,
  irsPractitionerUser,
  petitionerUser,
  petitionsClerkUser,
  privatePractitionerUser,
} from '../../../../shared/src/test/mockUsers';
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
  it('should set showExternalButtons false if user is an internal user', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: { docketEntries: [] },
      },
    });
    expect(result.showExternalButtons).toEqual(false);
  });

  it('should set showExternalButtons false if user is an external user and the case does not have any served docket entries', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(petitionerUser),
        caseDetail: { docketEntries: [] },
      },
    });
    expect(result.showExternalButtons).toEqual(false);
  });

  it('should set showExternalButtons true if user is an external user and the case has served docket entries', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(petitionerUser),
        caseDetail: {
          docketEntries: [
            { documentType: 'Petition', servedAt: '2019-03-01T21:40:46.415Z' },
          ],
        },
      },
    });
    expect(result.showExternalButtons).toEqual(true);
  });

  it('should set showExternalButtons true if user is an external user and the case has isLegacyServed docket entries', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(petitionerUser),
        caseDetail: {
          docketEntries: [{ documentType: 'Answer', isLegacyServed: true }],
        },
      },
    });
    expect(result.showExternalButtons).toEqual(true);
  });

  it('should set showFileFirstDocumentButton and showRequestAccessToCaseButton to false if user role is respondent and the respondent is associated with the case', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(irsPractitionerUser),
        caseDetail: {
          docketEntries: [],
          irsPractitioners: [{ userId: '789' }],
        },
        screenMetadata: {
          isAssociated: true,
        },
      },
    });
    expect(result.showFileFirstDocumentButton).toEqual(false);
    expect(result.showRequestAccessToCaseButton).toEqual(false);
  });

  it('should set showFileFirstDocumentButton and showRequestAccessToCaseButton to false if user role is respondent and the respondent is not associated with the case but the case is sealed', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(irsPractitionerUser),
        caseDetail: {
          docketEntries: [],
          hasIrsPractitioner: true,
          isSealed: true,
        },
        screenMetadata: {
          isAssociated: false,
        },
      },
    });
    expect(result.showFileFirstDocumentButton).toEqual(false);
    expect(result.showRequestAccessToCaseButton).toEqual(false);
  });

  it('should set showRequestAccessToCaseButton to true if user role is respondent and the respondent is not associated with the case', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(irsPractitionerUser),
        caseDetail: {
          docketEntries: [],
          hasIrsPractitioner: true,
        },
        screenMetadata: {
          isAssociated: false,
        },
      },
    });
    expect(result.showFileFirstDocumentButton).toEqual(false);
    expect(result.showRequestAccessToCaseButton).toEqual(true);
  });

  it('should set showFileFirstDocumentButton to true if user role is respondent and there is no respondent associated with the case', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(irsPractitionerUser),
        caseDetail: {
          docketEntries: [],
          hasIrsPractitioner: false,
        },
        screenMetadata: {
          isAssociated: false,
        },
      },
    });
    expect(result.showFileFirstDocumentButton).toEqual(true);
    expect(result.showRequestAccessToCaseButton).toEqual(false);
  });

  it('should set showPendingAccessToCaseButton to true if user role is practitioner and case is not owned by user but has pending request', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(privatePractitionerUser),
        caseDetail: { docketEntries: [] },
        screenMetadata: {
          isAssociated: false,
          pendingAssociation: true,
        },
      },
    });
    expect(result.showPendingAccessToCaseButton).toEqual(true);
  });

  it('should set showRequestAccessToCaseButton to true if user role is practitioner and case is not owned by user', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(privatePractitionerUser),
        caseDetail: { docketEntries: [] },
        screenMetadata: {
          isAssociated: false,
        },
      },
    });
    expect(result.showRequestAccessToCaseButton).toEqual(true);
  });

  it('should set showRequestAccessToCaseButton to false when the current page is FilePetitionSuccess', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(privatePractitionerUser),
        caseDetail: { docketEntries: [] },
        currentPage: 'FilePetitionSuccess',
        screenMetadata: {
          isAssociated: false,
        },
      },
    });
    expect(result.showRequestAccessToCaseButton).toEqual(false);
  });

  it('should set showRequestAccessToCaseButton to false if user role is practitioner and case is not owned by user and the case is sealed', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(privatePractitionerUser),
        caseDetail: { docketEntries: [], isSealed: true },
        screenMetadata: {
          isAssociated: false,
        },
      },
    });
    expect(result.showRequestAccessToCaseButton).toEqual(false);
  });

  it('should set showRequestAccessToCaseButton to false if user role is practitioner and case is owned by user', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(privatePractitionerUser),
        caseDetail: {
          docketEntries: [],
          privatePractitioners: [{ userId: '123' }],
        },
        screenMetadata: {
          isAssociated: true,
        },
      },
    });
    expect(result.showRequestAccessToCaseButton).toEqual(false);
  });

  it('should set showRequestAccessToCaseButton to false if user role is petitioner and user is not associated with the case', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(petitionerUser),
        caseDetail: { docketEntries: [] },
        screenMetadata: {
          isAssociated: false,
        },
      },
    });
    expect(result.showRequestAccessToCaseButton).toEqual(false);
  });

  it('should show the consolidated case icon if the case is associated with a lead case', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [],
          leadDocketNumber: '101-20',
        },
      },
    });

    expect(result.showConsolidatedCaseIcon).toEqual(true);
  });

  it('should NOT show the consolidated case icon if the case is NOT associated with a lead case', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [],
          leadDocketNumber: '',
        },
      },
    });

    expect(result.showConsolidatedCaseIcon).toEqual(false);
  });

  it('should show the case detail header menu and add docket entry and create order buttons if current page is CaseDetailInternal and user role is docketclerk', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: { docketEntries: [] },
        currentPage: 'CaseDetailInternal',
      },
    });
    expect(result.showCaseDetailHeaderMenu).toEqual(true);
    expect(result.showAddDocketEntryButton).toEqual(true);
    expect(result.showCreateOrderButton).toEqual(true);
  });

  it('should show the Sealed Case banner if the case is sealed', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        caseDetail: { docketEntries: [], isSealed: true },
        permissions: {},
      },
    });
    expect(result.showSealedCaseBanner).toEqual(true);
  });

  it('should show file document button if user has FILE_EXTERNAL_DOCUMENT permission and the user is associated with the case', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(petitionerUser),
        caseDetail: { docketEntries: [] },
        screenMetadata: { isAssociated: true },
      },
    });
    expect(result.showFileDocumentButton).toEqual(true);
  });

  it('should not show file document button if user does not have FILE_EXTERNAL_DOCUMENT permission', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: { docketEntries: [] },
        screenMetadata: { isAssociated: true },
      },
    });
    expect(result.showFileDocumentButton).toEqual(false);
  });

  it('should not show file document button if user has FILE_EXTERNAL_DOCUMENT permission but the user is not associated with the case', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(petitionerUser),
        caseDetail: { docketEntries: [] },
        screenMetadata: { isAssociated: false },
      },
    });
    expect(result.showFileDocumentButton).toEqual(false);
  });

  it('should show the Upload PDF button in the action menu if the user is a court user', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: { docketEntries: [] },
        screenMetadata: { isAssociated: false },
      },
    });

    expect(result.showUploadCourtIssuedDocumentButton).toEqual(true);
  });

  it('should NOT show the Upload PDF button in the action menu if the user is not a court user', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(petitionerUser),
        caseDetail: { docketEntries: [] },
        screenMetadata: { isAssociated: false },
      },
    });

    expect(result.showUploadCourtIssuedDocumentButton).toEqual(false);
  });

  it('should set showNewTabLink to true if user is an internal user', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: { docketEntries: [] },
        currentPage: 'CaseDetailInternal',
      },
    });
    expect(result.showNewTabLink).toBe(true);
  });

  it('should set showNewTabLink to false if user is an external user', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(petitionerUser),
        caseDetail: { docketEntries: [] },
        currentPage: 'CaseDetailInternal',
      },
    });
    expect(result.showNewTabLink).toBe(false);
  });

  it('should set showCreateMessageButton to false when the user role is General', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(generalUser),
        caseDetail: { docketEntries: [] },
        currentPage: 'CaseDetailInternal',
      },
    });

    expect(result.showCreateMessageButton).toBe(false);
  });

  it('should set showCreateMessageButton to true when the user role is NOT General', () => {
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: { docketEntries: [] },
        currentPage: 'CaseDetailInternal',
      },
    });

    expect(result.showCreateMessageButton).toBe(true);
  });

  describe('showRepresented', () => {
    it('is true when at least one party on the case is represented and the current user is an internal user', () => {
      const representedUserId = '79c404b8-7ddc-4c48-974c-40b153c25f9e';

      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
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
        },
      });

      expect(result.showRepresented).toBe(true);
    });

    it('is false when no petitioner on the case is represented and the current user is an internal user', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
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
        },
      });

      expect(result.showRepresented).toBe(false);
    });

    it('is false when the logged in user is an external user', () => {
      const representedUserId = '79c404b8-7ddc-4c48-974c-40b153c25f9e';

      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          ...getBaseState(petitionerUser),
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
        },
      });

      expect(result.showRepresented).toBe(false);
    });
  });

  describe('showBlockedTag', () => {
    it('should be true when blocked is true', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...MOCK_CASE,
            blocked: true,
            blockedDate: '2019-04-19T17:29:13.120Z',
            blockedReason: 'because',
          },
        },
      });

      expect(result.showBlockedTag).toBeTruthy();
    });

    it('should be true when blocked is false, automaticBlocked is true, and case status is NOT calendared', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...MOCK_CASE,
            automaticBlocked: true,
            automaticBlockedDate: '2019-04-19T17:29:13.120Z',
            automaticBlockedReason: 'Pending Item',
            status: CASE_STATUS_TYPES.new,
          },
        },
      });

      expect(result.showBlockedTag).toBeTruthy();
    });

    it('should be false when blocked is false, automaticBlocked is true, and case status is calendared', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...MOCK_CASE,
            automaticBlocked: true,
            automaticBlockedDate: '2019-04-19T17:29:13.120Z',
            automaticBlockedReason: 'Pending Item',
            status: CASE_STATUS_TYPES.calendared,
          },
        },
      });

      expect(result.showBlockedTag).toBeFalsy();
    });

    it('should not throw an exception when petitioners array is undefined', () => {
      expect(() =>
        runCompute(caseDetailHeaderHelper, {
          state: {
            ...getBaseState(docketClerkUser),
            caseDetail: {
              ...MOCK_CASE,
              petitioners: undefined,
            },
          },
        }),
      ).not.toThrow();
    });
  });
});
