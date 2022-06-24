/* eslint-disable max-lines */
import {
  DOCKET_ENTRY_SEALED_TO_TYPES,
  PARTIES_CODES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextPublic } from '../../../applicationContextPublic';
import {
  formatDocketEntryOnDocketRecord,
  publicCaseDetailHelper as publicCaseDetailHelperComputed,
} from './publicCaseDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../withAppContext';

describe('publicCaseDetailHelper', () => {
  let state;

  const publicCaseDetailHelper = withAppContextDecorator(
    publicCaseDetailHelperComputed,
    applicationContextPublic,
  );
  const { DOCUMENT_PROCESSING_STATUS_OPTIONS, INITIAL_DOCUMENT_TYPES } =
    applicationContextPublic.getConstants();

  const baseDocketEntry = {
    docketEntryId: 'ae454c18-be84-4a2b-b055-9046ada4f65d',
    documentTitle: 'PRE-TRIAL MEMORANDUM for Resp. (C/S 5-16-13)',
    documentType: 'Miscellaneous',
    eventCode: 'PMT',
    filedBy: 'See Filings and Proceedings',
    filingDate: '2013-05-16T00:00:00.000-04:00',
    index: 14,
    isFileAttached: true,
    isMinuteEntry: false,
    isOnDocketRecord: true,
    isSealed: false,
    isStricken: false,
    numberOfPages: 5,
    processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    receivedAt: '2013-05-16T00:00:00.000-04:00',
  };

  beforeEach(() => {
    state = {
      caseDetail: {
        docketEntries: [],
        docketNumber: '123-45',
      },
    };
  });

  describe('formatDocketEntryOnDocketRecord', () => {
    it('should compute sealedToTooltip value when the entry is sealed', () => {
      const mockSealedDocketEntry = {
        description: 'Request for Place of Trial at Flavortown, TN',
        documentType:
          INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
        eventCode: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
        isSealed: true,
        sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
        sealedToTooltip: undefined,
      };

      const result = formatDocketEntryOnDocketRecord(applicationContextPublic, {
        entry: mockSealedDocketEntry,
        isTerminalUser: false,
      });

      expect(result.sealedToTooltip).toBe('Sealed to the public');
    });

    it('should NOT compute sealedToTooltip value when the entry is NOT sealed', () => {
      const mockDocketEntry = {
        description: 'Request for Place of Trial at Flavortown, TN',
        documentType:
          INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
        eventCode: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
        isSealed: false,
        sealedToTooltip: undefined,
      };

      const result = formatDocketEntryOnDocketRecord(applicationContextPublic, {
        entry: mockDocketEntry,
        isTerminalUser: false,
      });

      expect(result.sealedToTooltip).toBe(undefined);
    });

    it('should set the value of isSealed on the record', () => {
      const mockDocketEntry = {
        description: 'Request for Place of Trial at Flavortown, TN',
        documentType:
          INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
        eventCode: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
        isSealed: false,
      };

      const result = formatDocketEntryOnDocketRecord(applicationContextPublic, {
        entry: mockDocketEntry,
        isTerminalUser: false,
      });

      expect(result.isSealed).toBe(mockDocketEntry.isSealed);
    });
  });

  describe('printableDocketRecord', () => {
    it('should show printable docket record button if canAllowPrintableDocketRecord is true', () => {
      const result = runCompute(publicCaseDetailHelper, {
        state: {
          caseDetail: {
            canAllowPrintableDocketRecord: true,
            docketEntries: [],
          },
        },
      });
      expect(result.showPrintableDocketRecord).toBeTruthy();
    });

    it('should not show printable docket record button if canAllowPrintableDocketRecord is false', () => {
      const result = runCompute(publicCaseDetailHelper, {
        state: {
          caseDetail: {
            canAllowPrintableDocketRecord: false,
            docketEntries: [],
          },
        },
      });
      expect(result.showPrintableDocketRecord).toBeFalsy();
    });
  });

  describe('formattedDocketEntriesOnDocketRecord', () => {
    it('should return the formattedDocketEntriesOnDocketRecord as an array', () => {
      const result = runCompute(publicCaseDetailHelper, { state });
      expect(
        Array.isArray(result.formattedDocketEntriesOnDocketRecord),
      ).toBeTruthy();
    });

    it('should return hasDocument false if the document is a minute entry', () => {
      state.caseDetail.docketEntries = [
        {
          description: 'Request for Place of Trial at Flavortown, TN',
          documentType:
            INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
          eventCode: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
          isMinuteEntry: true,
          isOnDocketRecord: true,
          userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
        },
      ];

      const result = runCompute(publicCaseDetailHelper, { state });
      expect(result.formattedDocketEntriesOnDocketRecord[0]).toMatchObject({
        description: 'Request for Place of Trial at Flavortown, TN',
        hasDocument: false,
      });
    });

    it('should not display a link for the PMT event code', () => {
      state.caseDetail.docketEntries = [
        {
          ...baseDocketEntry,
          documentTitle: 'PRE-TRIAL MEMORANDUM for Resp. (C/S 5-16-13)',
          documentType: 'Miscellaneous',
          eventCode: 'PMT',
        },
      ];
      const result = runCompute(publicCaseDetailHelper, { state });

      expect(
        result.formattedDocketEntriesOnDocketRecord[0].showLinkToDocument,
      ).toBeFalsy();
    });

    it('should not show a link for documents not visible to the public', () => {
      state.caseDetail.docketEntries = [
        {
          ...baseDocketEntry,
          docketEntryId: '596223c1-527b-46b4-98b0-1b10455e9495',
          documentTitle: 'Petition',
          documentType: 'Petition',
          eventCode: 'P',
          index: 1,
          isLegacyServed: true,
        },
        {
          ...baseDocketEntry,
          docketEntryId: 'af6f67db-3160-4562-ac36-5481ab091952',
          documentTitle:
            'Request for Place of Trial at San Francisco, California',
          documentType: 'Request for Place of Trial',
          eventCode: 'RQT',
          index: 2,
          isLegacyServed: true,
        },
        {
          ...baseDocketEntry,
          docketEntryId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
          documentTitle: 'Order of Dismissal and Decision Entered, Judge Buch',
          documentType: 'Order of Dismissal and Decision',
          eventCode: 'ODD',
          index: 3,
          isLegacyServed: true,
        },
        {
          ...baseDocketEntry,
          docketEntryId: '162d3c72-2a31-4c66-b3f4-efaceb2cf0fd',
          documentTitle:
            'Notice of Trial on 12/30/2019 at San Francisco, California',
          documentType: 'Notice of Trial',
          eventCode: 'NTD',
          index: 4,
          isLegacyServed: true,
        },
        {
          ...baseDocketEntry,
          docketEntryId: 'a456c942-9d19-491a-b764-e2eac34205b0',
          documentTitle: 'Standing Pretrial Order',
          documentType: 'Standing Pretrial Order',
          eventCode: 'SPTO',
          index: 5,
          isLegacyServed: true,
        },
        {
          ...baseDocketEntry,
          docketEntryId: '71ac5f88-2316-4670-89bd-3decb99cf3ba',
          documentTitle: 'Standing Pretrial Order',
          documentType: 'Standing Pretrial Order',
          eventCode: 'SPTO',
          index: 6,
          isFileAttached: false,
          isLegacyServed: true,
        },
      ];

      const result = runCompute(publicCaseDetailHelper, { state });

      expect(result.formattedDocketEntriesOnDocketRecord).toMatchObject([
        {
          descriptionDisplay: 'Petition',
          docketEntryId: '596223c1-527b-46b4-98b0-1b10455e9495',
          eventCode: 'P',
          index: 1,
          showLinkToDocument: false,
        },
        {
          descriptionDisplay:
            'Request for Place of Trial at San Francisco, California',
          docketEntryId: 'af6f67db-3160-4562-ac36-5481ab091952',
          eventCode: 'RQT',
          index: 2,
          showLinkToDocument: false,
        },
        {
          descriptionDisplay:
            'Order of Dismissal and Decision Entered, Judge Buch',
          docketEntryId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
          eventCode: 'ODD',
          index: 3,
          showLinkToDocument: true,
        },
        {
          descriptionDisplay:
            'Notice of Trial on 12/30/2019 at San Francisco, California',
          docketEntryId: '162d3c72-2a31-4c66-b3f4-efaceb2cf0fd',
          eventCode: 'NTD', // not in EVENT_CODES_VISIBLE_TO_PUBLIC
          index: 4,
          showLinkToDocument: false,
        },
        {
          descriptionDisplay: 'Standing Pretrial Order',
          docketEntryId: 'a456c942-9d19-491a-b764-e2eac34205b0',
          eventCode: 'SPTO',
          index: 5,
          showLinkToDocument: true,
        },
        {
          descriptionDisplay: 'Standing Pretrial Order',
          docketEntryId: '71ac5f88-2316-4670-89bd-3decb99cf3ba',
          eventCode: 'SPTO',
          index: 6,
          showLinkToDocument: false,
        },
      ]);
    });

    it('should not show a link for sealed docket entries requested by a public user', () => {
      state.caseDetail.docketEntries = [
        {
          ...baseDocketEntry,
          docketEntryId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
          documentTitle: 'Order of Dismissal and Decision Entered, Judge Buch',
          documentType: 'Order of Dismissal and Decision',
          eventCode: 'ODD',
          index: 0,
          isSealed: true,
          servedAt: '2019-12-30T21:00:00.000Z',
        },
      ];

      const result = runCompute(publicCaseDetailHelper, { state });

      expect(
        result.formattedDocketEntriesOnDocketRecord[0].showLinkToDocument,
      ).toBe(false);
    });

    it('should show a link for documents requested by a terminal user', () => {
      state.caseDetail.docketEntries = [
        {
          ...baseDocketEntry,
          docketEntryId: '596223c1-527b-46b4-98b0-1b10455e9495',
          documentTitle: 'Petition',
          documentType: 'Petition',
          eventCode: 'P',
          index: 1,
          isLegacyServed: true,
        },
        {
          ...baseDocketEntry,
          docketEntryId: 'af6f67db-3160-4562-ac36-5481ab091952',
          documentTitle:
            'Request for Place of Trial at San Francisco, California',
          documentType: 'Request for Place of Trial',
          eventCode: 'RQT',
          index: 2,
          isLegacyServed: true,
        },
        {
          ...baseDocketEntry,
          docketEntryId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
          documentTitle: 'Order of Dismissal and Decision Entered, Judge Buch',
          documentType: 'Order of Dismissal and Decision',
          eventCode: 'ODD',
          index: 3,
          isLegacyServed: true,
        },
        {
          ...baseDocketEntry,
          docketEntryId: '162d3c72-2a31-4c66-b3f4-efaceb2cf0fd',
          documentTitle:
            'Notice of Trial on 12/30/2019 at San Francisco, California',
          documentType: 'Notice of Trial',
          eventCode: 'NTD',
          index: 4,
          isLegacyServed: true,
        },
        {
          ...baseDocketEntry,
          docketEntryId: 'a456c942-9d19-491a-b764-e2eac34205b0',
          documentTitle: 'Standing Pretrial Order',
          documentType: 'Standing Pretrial Order',
          eventCode: 'SPTO',
          index: 5,
          isLegacyServed: true,
        },
        {
          ...baseDocketEntry,
          docketEntryId: '71ac5f88-2316-4670-89bd-3decb99cf3ba',
          documentTitle: 'Standing Pretrial Order',
          documentType: 'Standing Pretrial Order',
          eventCode: 'SPTO',
          index: 6,
          isFileAttached: false,
          isLegacyServed: true,
        },
      ];

      const result = runCompute(publicCaseDetailHelper, {
        state: { ...state, isTerminalUser: true },
      });

      expect(result.formattedDocketEntriesOnDocketRecord).toMatchObject([
        {
          descriptionDisplay: 'Petition',
          docketEntryId: '596223c1-527b-46b4-98b0-1b10455e9495',
          eventCode: 'P',
          index: 1,
          openInSameTab: false,
          showLinkToDocument: true,
        },
        {
          descriptionDisplay:
            'Request for Place of Trial at San Francisco, California',
          docketEntryId: 'af6f67db-3160-4562-ac36-5481ab091952',
          eventCode: 'RQT',
          index: 2,
          openInSameTab: false,
          showLinkToDocument: true,
        },
        {
          descriptionDisplay:
            'Order of Dismissal and Decision Entered, Judge Buch',
          docketEntryId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
          eventCode: 'ODD',
          index: 3,
          openInSameTab: false,
          showLinkToDocument: true,
        },
        {
          descriptionDisplay:
            'Notice of Trial on 12/30/2019 at San Francisco, California',
          docketEntryId: '162d3c72-2a31-4c66-b3f4-efaceb2cf0fd',
          eventCode: 'NTD', // not in EVENT_CODES_VISIBLE_TO_PUBLIC
          index: 4,
          openInSameTab: false,
          showLinkToDocument: true,
        },
        {
          descriptionDisplay: 'Standing Pretrial Order',
          docketEntryId: 'a456c942-9d19-491a-b764-e2eac34205b0',
          eventCode: 'SPTO',
          index: 5,
          openInSameTab: false,
          showLinkToDocument: true,
        },
        {
          descriptionDisplay: 'Standing Pretrial Order',
          docketEntryId: '71ac5f88-2316-4670-89bd-3decb99cf3ba',
          eventCode: 'SPTO',
          index: 6,
          openInSameTab: false,
          showLinkToDocument: false,
        },
      ]);
    });

    it('should not show a link for sealed documents requested by a terminal user', () => {
      state.caseDetail.docketEntries = [
        {
          ...baseDocketEntry,
          docketEntryId: '71ac5f88-2316-4670-89bd-3decb99cf3ba',
          documentTitle: 'Standing Pretrial Order',
          documentType: 'Standing Pretrial Order',
          eventCode: 'SPTO',
          index: 1,
          isFileAttached: false,
          isLegacyServed: true,
          isSealed: true,
        },
        {
          ...baseDocketEntry,
          docketEntryId: '71ac5f88-2316-4670-89bd-3decb99cf3ba',
          documentTitle: 'Standing Pretrial Order',
          documentType: 'Standing Pretrial Order',
          eventCode: 'SPTO',
          index: 2,
          isFileAttached: false,
          isLegacySealed: true,
          isLegacyServed: true,
        },
      ];

      const result = runCompute(publicCaseDetailHelper, {
        state: { ...state, isTerminalUser: true },
      });

      expect(result.formattedDocketEntriesOnDocketRecord).toMatchObject([
        {
          descriptionDisplay: 'Standing Pretrial Order',
          docketEntryId: '71ac5f88-2316-4670-89bd-3decb99cf3ba',
          eventCode: 'SPTO',
          index: 1,
          openInSameTab: false,
          showLinkToDocument: false,
        },
        {
          descriptionDisplay: 'Standing Pretrial Order',
          docketEntryId: '71ac5f88-2316-4670-89bd-3decb99cf3ba',
          eventCode: 'SPTO',
          index: 2,
          openInSameTab: false,
          showLinkToDocument: false,
        },
      ]);
    });
  });

  it('should indicate when a case is sealed', () => {
    state.caseDetail.isSealed = true;
    const result = runCompute(publicCaseDetailHelper, { state });
    expect(result.formattedCaseDetail.isCaseSealed).toBeTruthy();
  });

  it('should return formatted docket entry', () => {
    state.caseDetail.docketEntries = [
      {
        ...baseDocketEntry,
        action: 'something',
        additionalInfo: 'additionalInfo!',
        additionalInfo2: 'additional info 2!',
        attachments: true,
        createdAt: '2018-11-21T20:49:28.192Z',
        description: 'first record',
        docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
        documentTitle: 'Petition',
        documentType: 'Petition',
        eventCode: 'P',
        filingDate: '2018-11-21T20:49:28.192Z',
        index: 4,
        openInSameTab: true,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
        servedPartiesCode: PARTIES_CODES.RESPONDENT,
      },
    ];

    const result = runCompute(publicCaseDetailHelper, { state });

    expect(result.formattedDocketEntriesOnDocketRecord).toMatchObject([
      {
        action: 'something',
        createdAtFormatted: '11/21/18',
        description: 'first record',
        descriptionDisplay: 'Petition',
        docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
        eventCode: 'P',
        filingsAndProceedingsWithAdditionalInfo:
          ' additionalInfo! (Attachment(s)) additional info 2!',
        index: 4,
        servedAtFormatted: undefined,
        servedPartiesCode: PARTIES_CODES.RESPONDENT,
        showDocumentDescriptionWithoutLink: true,
        showLinkToDocument: false,
        showNotServed: true,
        showServed: false,
      },
    ]);
  });

  it('should sort docket entries chronologically by date', () => {
    state.caseDetail.docketEntries = [
      {
        ...baseDocketEntry,
        createdAt: '2018-11-21T20:49:28.192Z',
        filingDate: '2018-11-21T20:49:28.192Z',
        index: 4,
      },
      {
        ...baseDocketEntry,
        createdAt: '2018-10-21T20:49:28.192Z',
        filingDate: '2018-10-21T20:49:28.192Z',
        index: 1,
      },
      {
        ...baseDocketEntry,
        createdAt: '2018-10-25T20:49:28.192Z',
        filingDate: '2018-10-25T20:49:28.192Z',
        index: 3,
      },
      {
        ...baseDocketEntry,
        createdAt: '2018-10-25T20:49:28.192Z',
        eventCode: 'O',
        filingDate: '2018-10-25T20:49:28.192Z',
        index: 2,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
      },
      {
        ...baseDocketEntry,
        createdAt: '2018-12-25T20:49:28.192Z',
        filingDate: '2018-12-25T20:49:28.192Z',
        index: 5,
      },
      {
        ...baseDocketEntry,
        createdAt: '2018-12-25T20:49:28.192Z',
        filingDate: '2018-12-25T20:49:28.192Z',
        index: 6,
      },
      {
        ...baseDocketEntry,
        createdAt: '2019-12-24T20:49:28.192Z',
        filingDate: '2019-12-24T20:49:28.192Z',
        index: 7,
      },
      {
        ...baseDocketEntry,
        createdAt: '2019-12-24T20:49:28.192Z',
        filingDate: '2019-12-24T20:49:28.192Z',
        index: 8,
      },
      {
        ...baseDocketEntry,
        createdAt: '2019-12-25T20:49:28.192Z',
        filingDate: '2019-12-25T20:49:28.192Z',
        index: 9,
      },
    ];

    const result = runCompute(publicCaseDetailHelper, { state });

    expect(result.formattedDocketEntriesOnDocketRecord).toMatchObject([
      {
        createdAtFormatted: '10/21/18',
        index: 1,
      },
      {
        createdAtFormatted: '10/25/18',
        index: 3,
      },
      {
        createdAtFormatted: '11/21/18',
        index: 4,
      },
      {
        createdAtFormatted: '12/25/18',
        index: 5,
      },
      {
        createdAtFormatted: '12/25/18',
        index: 6,
      },
      {
        createdAtFormatted: '12/24/19',
        index: 7,
      },
      {
        createdAtFormatted: '12/24/19',
        index: 8,
      },
      {
        createdAtFormatted: '12/25/19',
        index: 9,
      },
      {
        createdAtFormatted: undefined,
        index: 2,
      },
    ]);
  });
});
