import {
  BRIEF_EVENTCODES,
  DOCKET_ENTRY_SEALED_TO_TYPES,
  ROLES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { cloneDeep } from 'lodash';
import {
  docketClerk1User,
  privatePractitionerUser,
} from '@shared/test/mockUsers';
import { getFormattedDocketEntry } from './formattedDocketEntries';
import { simpleDocketEntries } from './formattedCaseDetail.test';

let mockIsNotServedDocument;
jest.mock('@shared/business/utilities/getFormattedCaseDetail', () => ({
  computeIsNotServedDocument: jest
    .fn()
    .mockImplementation(() => mockIsNotServedDocument),
}));

describe('getFormattedDocketEntry', () => {
  let simpleDocketEntry;
  let mockCase;
  let baseParams;

  const { DOCUMENT_PROCESSING_STATUS_OPTIONS } =
    applicationContext.getConstants();

  const rootDocument = {
    docketEntryId: '743595eb-e3e2-4308-859d-e4215fe8b706',
    documentType: 'Petition',
    eventCode: 'P',
  };

  // some of these values are computed in getFormattedCaseDetail and
  // sent in to formattedCaseDetail
  const servedCourtIssuedDocketEntry = {
    ...simpleDocketEntry,
    archived: false,
    createdAt: '2019-02-28T21:14:39.488Z',
    eventCode: 'O',
    isCourtIssuedDocument: true,
    isDraft: false,
    isFileAttached: true,
    isOnDocketRecord: true,
    processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    qcWorkItemsCompleted: true,
    servedAt: '2019-02-28T21:14:39.488Z',
  };

  beforeEach(() => {
    mockIsNotServedDocument = false;
    mockCase = cloneDeep(MOCK_CASE);
    baseParams = {
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
      entry: simpleDocketEntry,
      formattedCase: {
        ...MOCK_CASE,
        filedByRole: ROLES.privatePractitioner,
      },
      permissions: {},
      rawCase: mockCase,
      user: docketClerk1User,
      visibilityPolicyDateFormatted: '',
    };

    simpleDocketEntry = {
      ...simpleDocketEntries[0],
      rootDocument,
    };
  });

  describe('showLoadingIcon', () => {
    it('should be true if isExternalUser is false, permissions.UPDATE_CASE is false, and entry.processingStatus is not complete', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
        },
        permissions: { UPDATE_CASE: false },
        user: docketClerk1User,
      });

      expect(result.showLoadingIcon).toBeTruthy();
    });

    it('should be false if isExternalUser is false, permissions.UPDATE_CASE is true, and entry.processingStatus is not complete', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
        },
        permissions: { UPDATE_CASE: true },
        user: docketClerk1User,
      });

      expect(result.showLoadingIcon).toBeFalsy();
    });

    it('should be false if isExternalUser is false, permissions.UPDATE_CASE is false, and entry.processingStatus is complete', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        },
        permissions: { UPDATE_CASE: false },
        user: docketClerk1User,
      });

      expect(result.showLoadingIcon).toBeFalsy();
    });

    it('should be false if isExternalUser is true', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
        },
        permissions: { UPDATE_CASE: false },
        user: privatePractitionerUser,
      });

      expect(result.showLoadingIcon).toBeFalsy();
    });
  });

  describe('isPaper', () => {
    it('should be true if isInProgress is false, qcWorkItemsUntouched is false, and isPaper is true', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          isInProgress: false,
          isPaper: true,
          qcWorkItemsUntouched: false,
        },
      });

      expect(result.isPaper).toBeTruthy();
    });

    it('should be false if isInProgress is false, qcWorkItemsUntouched is false, and isPaper is false', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          isInProgress: false,
          isPaper: false,
          qcWorkItemsUntouched: false,
        },
      });

      expect(result.isPaper).toBeFalsy();
    });

    it('should be false if isInProgress is true, qcWorkItemsUntouched is false, and isPaper is true', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          isInProgress: true,
          isPaper: true,
          qcWorkItemsUntouched: false,
        },
      });

      expect(result.isPaper).toBeFalsy();
    });

    it('should be false if isInProgress is false, qcWorkItemsUntouched is true, and isPaper is true', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          isInProgress: false,
          isPaper: true,
          qcWorkItemsUntouched: true,
        },
      });

      expect(result.isPaper).toBeFalsy();
    });
  });

  describe('descriptionDisplay', () => {
    it('should call getDescriptionDisplay and return only documentTitle with no other information', () => {
      const expectedDescriptionDisplay = 'Answer';
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          additionalInfo: undefined,
          documentTitle: 'Answer',
        },
      });

      expect(
        applicationContext.getUtilities().getDescriptionDisplay,
      ).toHaveBeenCalled();
      expect(result.descriptionDisplay).toEqual(expectedDescriptionDisplay);
    });

    it('should call getDescriptionDisplay if entry.documentTitle is set and return its result using document title and additional info', () => {
      const additionalInfo = 'With Extra Things';

      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          addToCoversheet: true,
          additionalInfo,
          documentTitle: 'Answer',
        },
      });

      expect(
        applicationContext.getUtilities().getDescriptionDisplay,
      ).toHaveBeenCalled();
      expect(result.descriptionDisplay).toEqual('Answer With Extra Things');
    });

    it('should not call getDescriptionDisplay or set descriptionDisplay on result if entry.documentTitle is undefined', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          documentTitle: undefined,
        },
      });

      expect(
        applicationContext.getUtilities().getDescriptionDisplay,
      ).not.toHaveBeenCalled();
      expect(result.descriptionDisplay).toBeUndefined();
    });
  });

  describe('showDocumentProcessing', () => {
    it('should be true if permissions.UPDATE_CASE is false and entry.processingStatus is not complete', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
        },

        permissions: { UPDATE_CASE: false },
      });

      expect(result.showDocumentProcessing).toBeTruthy();
    });

    it('should be false if permissions.UPDATE_CASE is false and entry.processingStatus is complete', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        },

        permissions: { UPDATE_CASE: false },
      });

      expect(result.showDocumentProcessing).toBeFalsy();
    });

    it('should be false if permissions.UPDATE_CASE is true and entry.processingStatus is not complete', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
        },

        permissions: { UPDATE_CASE: true },
      });

      expect(result.showDocumentProcessing).toBeFalsy();
    });
  });

  describe('showNotServed', () => {
    it('should be true if computeIsNotServedDocument returns true', () => {
      mockIsNotServedDocument = true;
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: simpleDocketEntry,
      });

      expect(result.showNotServed).toBeTruthy();
    });

    it('should be false if computeIsNotServedDocument returns false', () => {
      mockIsNotServedDocument = false;
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: simpleDocketEntry,
      });

      expect(result.showNotServed).toBeFalsy();
    });
  });

  describe('showServed', () => {
    it('should be true if entry.isStatusServed is true', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          isStatusServed: true,
        },
      });

      expect(result.showServed).toBeTruthy();
    });

    it('should be false if entry.isStatusServed is false', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          isStatusServed: false,
        },
      });

      expect(result.showServed).toBeFalsy();
    });
  });

  describe('showDocumentViewerLink', () => {
    it('should be true if isExternalUser is false and document links are shown', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...servedCourtIssuedDocketEntry,
        },
      });

      expect(result.showDocumentViewerLink).toBeTruthy();
    });

    it('should be false if isExternalUser is false and document links are not shown', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
        },
      });

      expect(result.showDocumentViewerLink).toBeFalsy();
    });

    it('should be false if isExternalUser is true', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...servedCourtIssuedDocketEntry,
        },
        user: privatePractitionerUser,
      });

      expect(result.showDocumentViewerLink).toBeFalsy();
    });
  });

  describe('showLinkToDocument', () => {
    it('should be true if isExternalUser is true and document links are shown', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...servedCourtIssuedDocketEntry,
        },
        user: privatePractitionerUser,
      });

      expect(result.showLinkToDocument).toBeTruthy();
    });

    it('should be false if isExternalUser is true and document links are not shown', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
        },
        user: privatePractitionerUser,
      });

      expect(result.showLinkToDocument).toBeFalsy();
    });

    it('should be false if isExternalUser is true and document links are not shown because the docket entry is a brief, not filed by practitioner', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          eventCode: 'SEAB',
        },
        user: privatePractitionerUser,
      });

      expect(result.showLinkToDocument).toBeFalsy();
    });

    it('should be false if isExternalUser is false', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...servedCourtIssuedDocketEntry,
        },
      });

      expect(result.showLinkToDocument).toBeFalsy();
    });

    it('should be true for an external user when filedAfterPolicyChange is true and the document was filed by a practitioner', () => {
      const entry = {
        ...servedCourtIssuedDocketEntry,
        eventCode: BRIEF_EVENTCODES[0],
        filedByRole: ROLES.privatePractitioner,
      };
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry,
        user: privatePractitionerUser,
      });

      expect(result.showLinkToDocument).toBe(true);
    });

    it('should be false for an external user when filedAfterPolicyChange is false and the document was filed by a practitioner', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        ...simpleDocketEntry,
        entry: {
          eventCode: BRIEF_EVENTCODES[0],
          rootDocument,
        },
        formattedCase: {
          ...MOCK_CASE,
          filedByRole: ROLES.privatePractitioner,
        },
        user: privatePractitionerUser,
      });

      expect(result.showLinkToDocument).toBe(false);
    });
  });

  describe('showEditDocketRecordEntry', () => {
    it('should be true if user has EDIT_DOCKET_ENTRY permissions', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...servedCourtIssuedDocketEntry,
        },
        permissions: {
          EDIT_DOCKET_ENTRY: true,
        },
      });

      expect(result.showEditDocketRecordEntry).toBeTruthy();
    });

    it('should be false if user does not have EDIT_DOCKET_ENTRY permissions', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...servedCourtIssuedDocketEntry,
        },
        permissions: {
          EDIT_DOCKET_ENTRY: false,
        },
      });

      expect(result.showEditDocketRecordEntry).toBeFalsy();
    });
  });

  describe('showDocumentDescriptionWithoutLink', () => {
    it('should be true if document links are not shown and document is not processing', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        },
      });

      expect(result.showDocumentDescriptionWithoutLink).toBeTruthy();
    });

    it('should be false if document links are shown and document is not processing', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...servedCourtIssuedDocketEntry,
          processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        },
      });

      expect(result.showDocumentDescriptionWithoutLink).toBeFalsy();
    });

    it('should be true when the user is external and NOT associated with the case and the docket entry is sealed', () => {
      const mockSealedDocketEntry = {
        documentTitle: 'Sealed to the public order',
        eventCode: 'O',
        isFileAttached: true,
        isSealed: true,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
        servedAt: '2019-03-01T21:00:00.000Z',
      };

      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: mockSealedDocketEntry,
        user: privatePractitionerUser,
      });

      expect(result.showDocumentDescriptionWithoutLink).toBe(true);
    });

    it('should be false when the user is external and associated with the case and the docket entry is sealed', () => {
      const mockSealedDocketEntry = {
        documentTitle: 'Sealed to the public order',
        eventCode: 'O',
        isFileAttached: true,
        isSealed: true,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
        servedAt: '2019-03-01T21:00:00.000Z',
      };

      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: mockSealedDocketEntry,
        rawCase: {
          ...mockCase,
          privatePractitioners: [privatePractitionerUser],
        },
        user: privatePractitionerUser,
      });

      expect(result.showDocumentDescriptionWithoutLink).toBe(false);
    });
  });

  describe('editDocketEntryMetaLink', () => {
    it('should contain docketNumber and entry index', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          index: 1234,
        },
      });

      expect(result.editDocketEntryMetaLink).toEqual(
        `/case-detail/${baseParams.docketNumber}/docket-entry/1234/edit-meta`,
      );
    });
  });

  describe('toolTipText', () => {
    it('should add a tooltip to (disabled) docket entries with no file attached', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: simpleDocketEntry,
      });

      expect(result.toolTipText).toEqual('No Document View');
    });

    it('should not add a tooltip to docket entries with a file attached', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          isFileAttached: true,
        },
      });

      expect(result.toolTipText).toBeUndefined();
    });
  });
});
