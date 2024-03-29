import {
  ATP_DOCKET_ENTRY,
  MOCK_DOCUMENTS,
  STANDING_PRETRIAL_ORDER_ENTRY,
} from '@shared/test/mockDocketEntry';
import { DOCKET_RECORD_FILTER_OPTIONS } from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { docketRecordHelper as docketRecordHelperCompute } from './docketRecordHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('docketRecordHelper', () => {
  let caseDetail;
  let permissions;
  let sessionMetadata;

  const docketRecordHelper = withAppContextDecorator(
    docketRecordHelperCompute,
    applicationContext,
  );
  const mockDocketNumberToSortBy = '111-11';
  const petitionDocument = { docketEntryId: MOCK_DOCUMENTS[0].docketEntryId };

  beforeEach(() => {
    caseDetail = {
      canAllowPrintableDocketRecord: true,
      docketEntries: MOCK_DOCUMENTS,
      docketNumber: MOCK_CASE.docketNumber,
    };
    permissions = {
      BATCH_DOWNLOAD_CASE_DOCUMENTS: false,
      EDIT_DOCKET_ENTRY: true,
      SEAL_DOCKET_ENTRY: false,
    };
    sessionMetadata = {
      docketRecordSort: {
        [mockDocketNumberToSortBy]: '',
      },
    };
  });

  describe('showEditOrSealDocketRecordEntry', () => {
    it('should be true when the user has EDIT_DOCKET_ENTRY permission', () => {
      const result = runCompute(docketRecordHelper, {
        state: {
          caseDetail,
          documentsSelectedForDownload: [petitionDocument],
          permissions,
          sessionMetadata,
        },
      });

      expect(result.showEditOrSealDocketRecordEntry).toBe(true);
    });

    it('should be true when the user has SEAL_DOCKET_ENTRY permission', () => {
      permissions.EDIT_DOCKET_ENTRY = false;
      permissions.SEAL_DOCKET_ENTRY = true;

      const result = runCompute(docketRecordHelper, {
        state: {
          caseDetail,
          documentsSelectedForDownload: [petitionDocument],
          permissions,
          sessionMetadata: {
            docketRecordSort: {
              [mockDocketNumberToSortBy]: '',
            },
          },
        },
      });

      expect(result.showEditOrSealDocketRecordEntry).toBe(true);
    });

    it('should be false when when the user does not have EDIT_DOCKET_ENTRY and SEAL_DOCKET_ENTRY permissions', () => {
      permissions.EDIT_DOCKET_ENTRY = false;
      permissions.SEAL_DOCKET_ENTRY = false;

      const result = runCompute(docketRecordHelper, {
        state: {
          caseDetail,
          documentsSelectedForDownload: [petitionDocument],
          permissions,
          sessionMetadata: {
            docketRecordSort: {
              [mockDocketNumberToSortBy]: '',
            },
          },
        },
      });

      expect(result.showEditOrSealDocketRecordEntry).toBe(false);
    });
  });

  describe('showPrintableDocketRecord', () => {
    it('should be set to the value of caseDetail.canAllowPrintableDocketRecord', () => {
      caseDetail.canAllowPrintableDocketRecord = true;

      const result = runCompute(docketRecordHelper, {
        state: {
          caseDetail,
          documentsSelectedForDownload: [petitionDocument],
          permissions: {},
          sessionMetadata: {
            docketRecordSort: {
              [mockDocketNumberToSortBy]: '',
            },
          },
        },
      });

      expect(result.showPrintableDocketRecord).toBe(true);
    });
  });

  describe('sortLabelTextMobile', () => {
    const sortLabelsMobile = {
      byDate: 'Oldest to Newest',
      byDateDesc: 'Newest to Oldest',
    };

    Object.entries(sortLabelsMobile).forEach(([sortType, sortLabel]) => {
      it(`should be ${sortLabel} when the sortOrder is ${sortType}`, () => {
        caseDetail.canAllowPrintableDocketRecord = true;
        caseDetail.docketNumber = mockDocketNumberToSortBy;

        const result = runCompute(docketRecordHelper, {
          state: {
            caseDetail,
            documentsSelectedForDownload: [petitionDocument],
            permissions: {},
            sessionMetadata: {
              docketRecordSort: {
                [mockDocketNumberToSortBy]: sortType,
              },
            },
          },
        });

        expect(result.sortLabelTextMobile).toBe(sortLabel);
      });
    });
  });

  describe('showBatchDownloadControls', () => {
    it('should be set to the value of permissions.BATCH_DOWNLOAD_CASE_DOCUMENTS', () => {
      permissions.BATCH_DOWNLOAD_CASE_DOCUMENTS = true;

      const result = runCompute(docketRecordHelper, {
        state: {
          caseDetail,
          documentsSelectedForDownload: [petitionDocument],
          permissions,
          sessionMetadata: {
            docketRecordSort: {
              [mockDocketNumberToSortBy]: '',
            },
          },
        },
      });

      expect(result.showBatchDownloadControls).toBe(true);
    });
  });

  describe('countOfDocumentsForDownload', () => {
    it('should get the count of the eligible documents to download filtered by "All documents"', () => {
      caseDetail.docketEntries = [
        petitionDocument,
        ATP_DOCKET_ENTRY,
        STANDING_PRETRIAL_ORDER_ENTRY,
      ];

      const mockDocumentsSelectedForDownload = [
        petitionDocument,
        ATP_DOCKET_ENTRY,
        STANDING_PRETRIAL_ORDER_ENTRY,
      ];
      sessionMetadata.docketRecordFilter = 'All documents';
      const result = runCompute(docketRecordHelper, {
        state: {
          caseDetail,
          documentsSelectedForDownload: mockDocumentsSelectedForDownload,
          permissions,
          sessionMetadata: {
            docketRecordSort: {
              [mockDocketNumberToSortBy]: '',
            },
          },
        },
      });

      expect(result.countOfDocumentsForDownload).toEqual(
        mockDocumentsSelectedForDownload.length,
      );
    });

    it('should get the count of the eligible documents to download filtered by a specific filter', () => {
      caseDetail.docketEntries = [
        petitionDocument,
        ATP_DOCKET_ENTRY,
        STANDING_PRETRIAL_ORDER_ENTRY,
      ];
      sessionMetadata.docketRecordFilter = DOCKET_RECORD_FILTER_OPTIONS.orders;

      const mockDocumentsSelectedForDownload = [
        petitionDocument,
        ATP_DOCKET_ENTRY,
        STANDING_PRETRIAL_ORDER_ENTRY,
      ];

      const result = runCompute(docketRecordHelper, {
        state: {
          caseDetail,
          documentsSelectedForDownload: mockDocumentsSelectedForDownload,
          permissions,
          sessionMetadata,
        },
      });

      expect(result.countOfDocumentsForDownload).toEqual(1);
    });
  });
});
