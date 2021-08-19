import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getFormattedDocketEntry } from './formattedDocketEntries';
import { simpleDocketEntries } from './formattedCaseDetail.test';

describe('getFormattedDocketEntry', () => {
  const { DOCUMENT_PROCESSING_STATUS_OPTIONS } =
    applicationContext.getConstants();

  const simpleDocketEntry = simpleDocketEntries[0];

  const baseParams = {
    applicationContext,
    docketNumber: MOCK_CASE.docketNumber,
    entry: simpleDocketEntry,
    isExternalUser: false,
    permissions: {},
    userAssociatedWithCase: true,
  };

  // some of these values are computed in getFormattedCaseDetail and
  // sent in to formattedCaseDetail
  const servedCourtIssuedDocketEntry = {
    ...simpleDocketEntry,
    archived: false,
    createdAt: '2019-02-28T21:14:39.488Z',
    eventCode: 'O',
    isAvailableToUser: true,
    isCourtIssuedDocument: true,
    isDraft: false,
    isFileAttached: true,
    isOnDocketRecord: true,
    qcWorkItemsCompleted: true,
    servedAt: '2019-02-28T21:14:39.488Z',
  };

  describe('hideIcons', () => {
    it('should be true if isExternalUser is true', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        isExternalUser: true,
      });

      expect(result.hideIcons).toBeTruthy();
    });

    it('should be false if isExternalUser is false', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        isExternalUser: false,
      });

      expect(result.hideIcons).toBeFalsy();
    });
  });

  describe('showLoadingIcon', () => {
    it('should be true if isExternalUser is false, permissions.UPDATE_CASE is false, and entry.processingStatus is not complete', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
        },
        isExternalUser: false,
        permissions: { UPDATE_CASE: false },
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
        isExternalUser: false,
        permissions: { UPDATE_CASE: true },
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
        isExternalUser: false,
        permissions: { UPDATE_CASE: false },
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
        isExternalUser: true,
        permissions: { UPDATE_CASE: false },
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
    it('should call getDocumentTitleWithAdditionalInfo if entry.documentTitle is set and return its result as descriptionDisplay', () => {
      const mockDescriptionDisplay = 'Answer With Extra Things';
      applicationContext
        .getUtilities()
        .getDocumentTitleWithAdditionalInfo.mockReturnValue(
          mockDescriptionDisplay,
        );

      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          documentTitle: 'Answer',
        },
      });

      expect(
        applicationContext.getUtilities().getDocumentTitleWithAdditionalInfo,
      ).toBeCalled();
      expect(result.descriptionDisplay).toEqual(mockDescriptionDisplay);
    });

    it('should not call getDocumentTitleWithAdditionalInfo or set descriptionDisplay on result if entry.documentTitle is undefined', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          documentTitle: undefined,
        },
      });

      expect(
        applicationContext.getUtilities().getDocumentTitleWithAdditionalInfo,
      ).not.toBeCalled();
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
    it('should be true if entry.isNotServedDocument is true', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          isNotServedDocument: true,
        },
      });

      expect(result.showNotServed).toBeTruthy();
    });

    it('should be false if entry.isNotServedDocument is false', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          isNotServedDocument: false,
        },
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
        isExternalUser: false,
      });

      expect(result.showDocumentViewerLink).toBeTruthy();
    });

    it('should be false if isExternalUser is false and document links are not shown', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
        },
        isExternalUser: false,
      });

      expect(result.showDocumentViewerLink).toBeFalsy();
    });

    it('should be false if isExternalUser is true', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...servedCourtIssuedDocketEntry,
        },
        isExternalUser: true,
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
        isExternalUser: true,
      });

      expect(result.showLinkToDocument).toBeTruthy();
    });

    it('should be false if isExternalUser is true and document links are not shown', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
        },
        isExternalUser: true,
      });

      expect(result.showLinkToDocument).toBeFalsy();
    });

    it('should be false if isExternalUser is false', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...servedCourtIssuedDocketEntry,
        },
        isExternalUser: false,
      });

      expect(result.showLinkToDocument).toBeFalsy();
    });
  });

  describe('filingsAndProceedingsWithAdditionalInfo', () => {
    it('should contain filingsAndProceedings and additionalInfo2 separated by a space', () => {
      const mockFilingsAndProceedings = 'Mock Filings and Proceedings';
      const mockAdditionalInfo2 = 'Mock Additional Info 2';

      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          additionalInfo2: mockAdditionalInfo2,
          filingsAndProceedings: mockFilingsAndProceedings,
        },
      });

      expect(result.filingsAndProceedingsWithAdditionalInfo).toEqual(
        ` ${mockFilingsAndProceedings} ${mockAdditionalInfo2}`,
      );
    });

    it('should be an empty string if filingsAndProceedings and additionalInfo2 are both undefined', () => {
      const result = getFormattedDocketEntry({
        ...baseParams,
        entry: {
          ...simpleDocketEntry,
          additionalInfo2: undefined,
          filingsAndProceedings: undefined,
        },
      });

      expect(result.filingsAndProceedingsWithAdditionalInfo).toEqual('');
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
});
