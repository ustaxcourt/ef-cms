/* eslint-disable max-lines */
import { CASE_STATUS_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
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
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('caseDetailHeaderHelper', () => {
  let globalUser;

  const getBaseState = user => {
    globalUser = user;
    return {
      caseDetail: { docketEntries: [], petitioners: [] },
      permissions: getUserPermissions(user),
    };
  };

  const caseDetailHeaderHelper = withAppContextDecorator(
    caseDetailHeaderHelperComputed,
    {
      ...applicationContext,
      getCurrentUser: () => {
        return globalUser;
      },
    },
  );

  describe('hidePublicCaseInformation', () => {
    it('should be true when the user is an internal user', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: getBaseState(docketClerkUser),
      });

      expect(result.hidePublicCaseInformation).toEqual(true);
    });
  });

  describe('showAddCorrespondenceButton', () => {
    it('should be true when the user has permission to create correspondences', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: getBaseState(docketClerkUser),
      });

      expect(result.showAddCorrespondenceButton).toEqual(true);
    });
  });

  describe('showAddDocketEntryButton', () => {
    it('should be true when the user has permission to add docket entries', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: getBaseState(docketClerkUser),
      });

      expect(result.showAddDocketEntryButton).toEqual(true);
    });
  });

  describe('showBlockedTag', () => {
    it('should be true when blocked is true', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...getBaseState(docketClerkUser).caseDetail,
            blocked: true,
          },
        },
      });

      expect(result.showBlockedTag).toBeTruthy();
    });

    it('should be false when blocked is false, automaticBlocked is true, and the case has a trial date', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...getBaseState(docketClerkUser).caseDetail,
            automaticBlocked: true,
            blocked: false,
            trialDate: '2020-03-01T00:00:00.000Z',
          },
        },
      });

      expect(result.showBlockedTag).toBeFalsy();
    });

    it('should be true when blocked is false, automaticBlocked is true, and the case has no trial date', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...getBaseState(docketClerkUser).caseDetail,
            automaticBlocked: true,
            blocked: false,
            status: CASE_STATUS_TYPES.calendared,
          },
        },
      });

      expect(result.showBlockedTag).toBeTruthy();
    });
  });

  describe('showCaseDetailHeaderMenu', () => {
    it('be true when the user is an internal user', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: getBaseState(docketClerkUser),
      });

      expect(result.showCaseDetailHeaderMenu).toEqual(true);
    });
  });

  describe('showConsolidatedCaseIcon', () => {
    it('should show the consolidated case icon when the case is directly associated with a lead case', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...getBaseState(docketClerkUser).caseDetail,
            leadDocketNumber: '101-20',
          },
        },
      });

      expect(result.showConsolidatedCaseIcon).toEqual(true);
    });

    it('should NOT show the consolidated case icon when the case is NOT directly associated with a lead case', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...getBaseState(docketClerkUser).caseDetail,
            leadDocketNumber: '',
          },
        },
      });

      expect(result.showConsolidatedCaseIcon).toEqual(false);
    });
  });

  describe('showCreateMessageButton', () => {
    it('should be false when the user role is General', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: getBaseState(generalUser),
      });

      expect(result.showCreateMessageButton).toBe(false);
    });

    it('should be true when the user role is NOT General', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: getBaseState(petitionsClerkUser),
      });

      expect(result.showCreateMessageButton).toBe(true);
    });
  });

  describe('showCreateOrderButton', () => {
    it('should be true when the user has permission to create court issued documents', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: getBaseState(docketClerkUser),
      });

      expect(result.showCreateOrderButton).toEqual(true);
    });
  });

  describe('showExternalButtons', () => {
    it('should be false when the user is an internal user', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: getBaseState(petitionsClerkUser),
      });

      expect(result.showExternalButtons).toEqual(false);
    });

    it('should be false when the user is an external user and service is not allowed for the case', () => {
      applicationContext
        .getUtilities()
        .canAllowDocumentServiceForCase.mockReturnValue(false);

      const result = runCompute(caseDetailHeaderHelper, {
        state: getBaseState(petitionerUser),
      });

      expect(result.showExternalButtons).toEqual(false);
    });

    it('should be true when the user is an external user and service is allowed for the case', () => {
      applicationContext
        .getUtilities()
        .canAllowDocumentServiceForCase.mockReturnValue(true);

      const result = runCompute(caseDetailHeaderHelper, {
        state: getBaseState(petitionerUser),
      });

      expect(result.showExternalButtons).toEqual(true);
    });
  });

  describe('showFileDocumentButton', () => {
    it('should be true when the petitioner user has FILE_EXTERNAL_DOCUMENT permission and they are directly associated with the case', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          ...getBaseState(petitionerUser),
          screenMetadata: { isDirectlyAssociated: true },
        },
      });

      expect(result.showFileDocumentButton).toEqual(true);
    });

    it('should be false when the user does not have FILE_EXTERNAL_DOCUMENT permission', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: getBaseState(docketClerkUser),
      });

      expect(result.showFileDocumentButton).toEqual(false);
    });

    it('should be false when the petitioner user has FILE_EXTERNAL_DOCUMENT permission but they are not directly associated with the case', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          ...getBaseState(petitionerUser),
          screenMetadata: { isDirectlyAssociated: false },
        },
      });

      expect(result.showFileDocumentButton).toEqual(false);
    });
  });

  describe('showFileFirstDocumentButton', () => {
    it("should be false when the user's role is respondent and they are directly associated with the case", () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          ...getBaseState(irsPractitionerUser),
          caseDetail: {
            ...getBaseState(irsPractitionerUser).caseDetail,
            irsPractitioners: [{ userId: '789' }],
          },
          screenMetadata: {
            isDirectlyAssociated: true,
          },
        },
      });

      expect(result.showFileFirstDocumentButton).toEqual(false);
    });

    it("should be false when the user's role is respondent, they are not directly associated with the case and the case is sealed", () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          ...getBaseState(irsPractitionerUser),
          caseDetail: {
            ...getBaseState(irsPractitionerUser).caseDetail,
            hasIrsPractitioner: true,
            isSealed: true,
          },
          screenMetadata: {
            isDirectlyAssociated: false,
          },
        },
      });

      expect(result.showFileFirstDocumentButton).toEqual(false);
    });

    it("should be false when the user's role is respondent and they are not directly associated with the case", () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          ...getBaseState(irsPractitionerUser),
          caseDetail: {
            ...getBaseState(irsPractitionerUser).caseDetail,
            hasIrsPractitioner: true,
          },
          screenMetadata: {
            isDirectlyAssociated: false,
          },
        },
      });

      expect(result.showFileFirstDocumentButton).toEqual(false);
    });

    it("should be true when the user's role is respondent, they are not directly associated with the case, and there is no other irsPractitioner on the case s(Public Case)", () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          ...getBaseState(irsPractitionerUser),
          caseDetail: {
            ...getBaseState(irsPractitionerUser).caseDetail,
            hasIrsPractitioner: false,
          },
          screenMetadata: {
            isDirectlyAssociated: false,
          },
        },
      });

      expect(result.showFileFirstDocumentButton).toEqual(true);
    });

    it("should be true when the user's role is respondent, they are not directly associated with the case, and there is already an irsPractitioner on the case (Full Case)", () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          ...getBaseState(irsPractitionerUser),
          caseDetail: {
            ...getBaseState(irsPractitionerUser).caseDetail,
            irsPractitioners: [
              {
                userId: 'something',
              },
            ],
          },
          screenMetadata: {
            isDirectlyAssociated: false,
          },
        },
      });

      expect(result.showFileFirstDocumentButton).toEqual(false);
    });
  });

  describe('showNewTabLink', () => {
    it('should be true when the user is an internal user', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: getBaseState(docketClerkUser),
      });

      expect(result.showNewTabLink).toBe(true);
    });

    it('should be false when the user is an external user', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: getBaseState(petitionerUser),
      });

      expect(result.showNewTabLink).toBe(false);
    });
  });

  describe('showPendingAccessToCaseButton', () => {
    it('should be true when the user is a practitioner and the user is not yet directly associated with the case but has pending request', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          ...getBaseState(privatePractitionerUser),
          screenMetadata: {
            isDirectlyAssociated: false,
            pendingAssociation: true,
          },
        },
      });

      expect(result.showPendingAccessToCaseButton).toEqual(true);
    });
  });

  describe('showRepresented', () => {
    it('should be true when at least one party on the case is represented and the current user is an internal user', () => {
      const representedUserId = '79c404b8-7ddc-4c48-974c-40b153c25f9e';

      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...getBaseState(petitionsClerkUser).caseDetail,
            petitioners: [
              {
                ...getContactPrimary(MOCK_CASE),
                contactId: representedUserId,
              },
            ],
            privatePractitioners: [{ representing: [representedUserId] }],
          },
        },
      });

      expect(result.showRepresented).toBe(true);
    });

    it('should be false when no petitioner on the case is represented and the current user is an internal user', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...getBaseState(petitionsClerkUser).caseDetail,
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
        },
      });

      expect(result.showRepresented).toBe(false);
    });

    it('should be false when the logged in user is an external user', () => {
      const representedUserId = '79c404b8-7ddc-4c48-974c-40b153c25f9e';

      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          ...getBaseState(petitionerUser),
          caseDetail: {
            ...getBaseState(petitionerUser).caseDetail,
            petitioners: [
              {
                ...getContactPrimary(MOCK_CASE),
                contactId: representedUserId,
              },
            ],
            privatePractitioners: [{ representing: [representedUserId] }],
          },
        },
      });

      expect(result.showRepresented).toBe(false);
    });
  });

  describe('showRequestAccessToCaseButton', () => {
    describe('when the user is an irs practitioner', () => {
      it('should be false when they are directly associated with the case', () => {
        const result = runCompute(caseDetailHeaderHelper, {
          state: {
            ...getBaseState(irsPractitionerUser),
            caseDetail: {
              ...getBaseState(irsPractitionerUser).caseDetail,
              irsPractitioners: [{ userId: '789' }],
            },
            screenMetadata: {
              isDirectlyAssociated: true,
            },
          },
        });

        expect(result.showRequestAccessToCaseButton).toEqual(false);
      });

      it('should be true when they are not directly associated with the case', () => {
        const result = runCompute(caseDetailHeaderHelper, {
          state: {
            ...getBaseState(irsPractitionerUser),
            caseDetail: {
              ...getBaseState(irsPractitionerUser).caseDetail,
              hasIrsPractitioner: true,
            },
            screenMetadata: {
              isDirectlyAssociated: false,
            },
          },
        });

        expect(result.showRequestAccessToCaseButton).toEqual(true);
      });

      it('should be false when they are not directly associated with the case and the case is sealed', () => {
        const result = runCompute(caseDetailHeaderHelper, {
          state: {
            ...getBaseState(irsPractitionerUser),
            caseDetail: {
              ...getBaseState(irsPractitionerUser).caseDetail,
              hasIrsPractitioner: true,
              isSealed: true,
            },
            screenMetadata: {
              isDirectlyAssociated: false,
            },
          },
        });

        expect(result.showRequestAccessToCaseButton).toEqual(false);
      });
    });

    describe('when the user is a private practitioner', () => {
      it('should be true when they are not directly associated with the case', () => {
        const result = runCompute(caseDetailHeaderHelper, {
          state: {
            ...getBaseState(privatePractitionerUser),
            screenMetadata: {
              isDirectlyAssociated: false,
            },
          },
        });

        expect(result.showRequestAccessToCaseButton).toEqual(true);
      });

      it('should be false they are directly associated with the case', () => {
        const result = runCompute(caseDetailHeaderHelper, {
          state: {
            ...getBaseState(privatePractitionerUser),
            caseDetail: {
              ...getBaseState(privatePractitionerUser).caseDetail,
              privatePractitioners: [{ userId: '123' }],
            },
            screenMetadata: {
              isDirectlyAssociated: true,
            },
          },
        });

        expect(result.showRequestAccessToCaseButton).toEqual(false);
      });

      it('should be false when they are not directly associated with the case and the case is sealed', () => {
        const result = runCompute(caseDetailHeaderHelper, {
          state: {
            ...getBaseState(privatePractitionerUser),
            caseDetail: {
              ...getBaseState(privatePractitionerUser).caseDetail,
              isSealed: true,
            },
            screenMetadata: {
              isDirectlyAssociated: false,
            },
          },
        });

        expect(result.showRequestAccessToCaseButton).toEqual(false);
      });

      it('should be false when they are on the Request Access Form page', () => {
        const result = runCompute(caseDetailHeaderHelper, {
          state: {
            ...getBaseState(privatePractitionerUser),
            currentPage: 'RequestAccessWizard',
          },
        });

        expect(result.showRequestAccessToCaseButton).toEqual(false);
      });

      it('should be false when the current page is FilePetitionSuccess', () => {
        const result = runCompute(caseDetailHeaderHelper, {
          state: {
            ...getBaseState(privatePractitionerUser),
            currentPage: 'FilePetitionSuccess',
          },
        });

        expect(result.showRequestAccessToCaseButton).toEqual(false);
      });
    });

    describe('when the user is a petitioner', () => {
      it('should be false when the user is a petitioner and they are not directly associated with the case', () => {
        const result = runCompute(caseDetailHeaderHelper, {
          state: {
            ...getBaseState(petitionerUser),
            screenMetadata: {
              isDirectlyAssociated: false,
            },
          },
        });

        expect(result.showRequestAccessToCaseButton).toEqual(false);
      });
    });
  });

  describe('showSealedCaseBanner', () => {
    it('should be true when the case is sealed', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: {
          caseDetail: {
            ...getBaseState(privatePractitionerUser).caseDetail,
            isSealed: true,
          },
          permissions: {},
        },
      });

      expect(result.showSealedCaseBanner).toEqual(true);
    });
  });

  describe('showUploadCourtIssuedDocumentButton', () => {
    it('should be true when the user is a court user', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: getBaseState(docketClerkUser),
      });

      expect(result.showUploadCourtIssuedDocumentButton).toEqual(true);
    });

    it('should be false when the user is not a court user', () => {
      const result = runCompute(caseDetailHeaderHelper, {
        state: getBaseState(petitionerUser),
      });

      expect(result.showUploadCourtIssuedDocumentButton).toEqual(false);
    });
  });
});
