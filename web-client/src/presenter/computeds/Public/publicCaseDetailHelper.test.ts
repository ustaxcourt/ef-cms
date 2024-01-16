/* eslint-disable max-lines */
import {
  AMICUS_BRIEF_DOCUMENT_TYPE,
  AMICUS_BRIEF_EVENT_CODE,
  DOCKET_ENTRY_SEALED_TO_TYPES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  PARTIES_CODES,
  POLICY_DATE_IMPACTED_EVENTCODES,
  PUBLIC_DOCKET_RECORD_FILTER_OPTIONS,
  ROLES,
  STIPULATED_DECISION_EVENT_CODE,
  UNSERVABLE_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import { MOCK_ANSWER, MOCK_MINUTE_ENTRY } from '@shared/test/mockDocketEntry';
import { applicationContextPublic } from '../../../applicationContextPublic';
import { formatDocketEntry } from '@shared/business/utilities/getFormattedCaseDetail';
import {
  formatDocketEntryOnDocketRecord,
  publicCaseDetailHelper as publicCaseDetailHelperComputed,
} from './publicCaseDetailHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../withAppContext';

const stipDecisionDocument = formatDocketEntry(applicationContextPublic, {
  addToCoversheet: false,
  attachments: false,
  createdAt: '2023-07-25T15:32:03.506Z',
  date: null,
  docketEntryId: 'bf0b82b0-f21b-4cab-90b6-0d5281ae25f4',
  docketNumber: '103-23',
  documentContentsId: 'eee1d0fe-67bd-4285-bfb1-48e81786bbe1',
  documentIdBeforeSignature: '989fd903-e579-4c73-b4ea-f20d06c39a35',
  documentTitle: 'Stipulated Decision Entered, Judge Ashford Anything',
  documentType: 'Stipulated Decision',
  draftOrderState: null,
  editState:
    '{"eventCode":"SDEC","documentType":"Stipulated Decision","documentTitle":"Stipulated Decision Entered, [Judge Name] [Anything]","scenario":"Type B","isOrder":true,"closesAndDismissesCase":true,"requiresSignature":true,"attachments":false,"date":null,"judgeWithTitle":"Judge Ashford","generatedDocumentTitle":"Stipulated Decision Entered, Judge Ashford Anything","judge":"Ashford","freeText":"Anything","docketEntryId":"bf0b82b0-f21b-4cab-90b6-0d5281ae25f4","docketNumber":"103-23","filersMap":{},"lodged":false}',
  entityName: 'DocketEntry',
  eventCode: 'SDEC',
  filers: [],
  filingDate: '2024-07-25T15:32:04.219Z',
  freeText: 'Anything',
  index: 7,
  isDraft: false,
  isFileAttached: true,
  isMinuteEntry: false,
  isOnDocketRecord: true,
  isPendingService: false,
  isStricken: false,
  judge: 'Ashford',
  numberOfPages: 1,
  pending: false,
  processingStatus: 'complete',
  receivedAt: '2023-07-25T04:00:00.000Z',
  relationship: 'primaryDocument',
  scenario: 'Type B',
  servedAt: '2023-07-25T15:32:04.219Z',
  servedParties: [
    {
      email: 'petitioner@example.com',
      name: 'Mona Schultz',
    },
    {
      name: 'Aliens, Dude',
    },
  ],
  servedPartiesCode: 'B',
  signedAt: '2023-07-25T15:32:03.506Z',
  signedByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
  signedJudgeName: 'Maurice B. Foley',
  stampData: {},
  userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
  workItem: {
    assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    assigneeName: 'Test Docketclerk',
    associatedJudge: 'Chief Judge',
    caseStatus: 'Closed',
    caseTitle: 'Mona Schultz & Aliens, Dude',
    completedAt: '2023-07-25T15:32:04.220Z',
    completedBy: 'Test Docketclerk',
    completedByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    completedMessage: 'completed',
    createdAt: '2023-07-25T15:32:03.737Z',
    docketEntry: {
      createdAt: '2023-07-25T15:32:03.506Z',
      docketEntryId: 'bf0b82b0-f21b-4cab-90b6-0d5281ae25f4',
      documentTitle: 'Stipulated Decision Entered, Judge Ashford Anything',
      documentType: 'Stipulated Decision',
      eventCode: 'SDEC',
      isFileAttached: true,
      receivedAt: '2023-07-25T04:00:00.000Z',
      servedAt: '2023-07-25T15:32:04.219Z',
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    },
    docketNumber: '103-23',
    docketNumberWithSuffix: '103-23L',
    entityName: 'WorkItem',
    hideFromPendingMessages: true,
    highPriority: false,
    section: 'docket',
    sentBy: 'Test Docketclerk',
    sentBySection: 'docket',
    sentByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    trialDate: null,
    trialLocation: null,
    updatedAt: '2023-07-25T15:32:03.737Z',
    workItemId: 'e142cd9f-cd77-458d-abeb-960bfdfb559c',
  },
});

describe('publicCaseDetailHelper', () => {
  let state;

  const publicCaseDetailHelper = withAppContextDecorator(
    publicCaseDetailHelperComputed,
    applicationContextPublic,
  );

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
      sessionMetadata: {
        docketRecordFilter: PUBLIC_DOCKET_RECORD_FILTER_OPTIONS.allDocuments,
        docketRecordSort: {},
      },
    };
  });

  describe('formattedDocketEntriesOnDocketRecord', () => {
    it('should be sorted chronologically by date', () => {
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

    it('should be sorted newer to older when sort order is byDateDesc', () => {
      state.sessionMetadata.docketRecordSort = { '123-45': 'byDateDesc' };
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
          createdAtFormatted: '12/25/19',
          index: 9,
        },

        {
          createdAtFormatted: '12/24/19',
          index: 8,
        },
        {
          createdAtFormatted: '12/24/19',
          index: 7,
        },
        {
          createdAtFormatted: '12/25/18',
          index: 6,
        },
        {
          createdAtFormatted: '12/25/18',
          index: 5,
        },
        {
          createdAtFormatted: '11/21/18',
          index: 4,
        },
        {
          createdAtFormatted: '10/25/18',
          index: 3,
        },
        {
          createdAtFormatted: '10/21/18',
          index: 1,
        },
        {
          createdAtFormatted: undefined,
          index: 2,
        },
      ]);
    });

    describe('filtering', () => {
      describe('docket record filtering', () => {
        const caseDetail = {
          docketEntries: [
            {
              ...baseDocketEntry,
              docketEntryId: '402ccc12-72c0-481e-b3f2-44debcd167a4',
              documentTitle: 'Exhibit for Noodles',
              eventCode: 'EXH',
            },
            {
              ...baseDocketEntry,
              docketEntryId: '402ccc12-72c0-481e-b3f2-44debcd167a4',
              documentTitle: 'Order in the Court',
              eventCode: 'O',
            },
            {
              ...baseDocketEntry,
              docketEntryId: '402ccc12-72c0-481e-b3f2-44debcd167a4',
              documentTitle: 'Motion in the Ocean',
              eventCode: 'M000',
            },
          ],
        };

        it('should ONLY show order type docket entries when "Orders" has been selected as the filter', () => {
          const result = runCompute(publicCaseDetailHelper, {
            state: {
              caseDetail,
              sessionMetadata: {
                docketRecordFilter: PUBLIC_DOCKET_RECORD_FILTER_OPTIONS.orders,
                docketRecordSort: {},
              },
            },
          });

          expect(result.formattedDocketEntriesOnDocketRecord.length).toBe(1);
          expect(result.formattedDocketEntriesOnDocketRecord[0].eventCode).toBe(
            'O',
          );
        });

        it('should ONLY show motion type docket entries when "Motions" has been selected as the filter', () => {
          const result = runCompute(publicCaseDetailHelper, {
            state: {
              caseDetail,
              sessionMetadata: {
                docketRecordFilter: PUBLIC_DOCKET_RECORD_FILTER_OPTIONS.motions,
                docketRecordSort: {},
              },
            },
          });

          expect(result.formattedDocketEntriesOnDocketRecord.length).toBe(1);
          expect(result.formattedDocketEntriesOnDocketRecord[0].eventCode).toBe(
            'M000',
          );
        });

        it('should show all docket entries when "All documents" has been selected as the filter', () => {
          const result = runCompute(publicCaseDetailHelper, {
            state: {
              caseDetail,
              sessionMetadata: {
                docketRecordFilter:
                  PUBLIC_DOCKET_RECORD_FILTER_OPTIONS.allDocuments,
                docketRecordSort: {},
              },
            },
          });

          expect(result.formattedDocketEntriesOnDocketRecord.length).toBe(
            caseDetail.docketEntries.length,
          );
        });
      });
    });

    describe('descriptionDisplay', () => {
      it('should descriptionDisplay for `OCS` type documents correctly and makes it visible to public users', () => {
        state.caseDetail.docketEntries = [
          {
            docketEntryId: 'd-1-2-3',
            documentTitle: 'Online Cited Source',
            documentType: 'Online Cited Source',
            eventCode: 'OCS',
            freeText: 'Test site viewed on 09/09/22',
            isFileAttached: true,
            isOnDocketRecord: true,
            isUnservable: true,
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
          },
        ];

        const result = runCompute(publicCaseDetailHelper, { state });

        expect(result.formattedDocketEntriesOnDocketRecord).toMatchObject([
          {
            descriptionDisplay:
              'Test site viewed on 09/09/22 - Online Cited Source',
            docketEntryId: 'd-1-2-3',
            eventCode: 'OCS',
            showLinkToDocument: true,
          },
        ]);
      });
    });

    describe('hasDocument', () => {
      it('should be false when the docket entry is a minute entry', () => {
        state.caseDetail.docketEntries = [MOCK_MINUTE_ENTRY];

        const { formattedDocketEntriesOnDocketRecord } = runCompute(
          publicCaseDetailHelper,
          { state },
        );

        expect(formattedDocketEntriesOnDocketRecord[0].hasDocument).toBe(false);
      });

      it('should be true when the docket entry is NOT a minute entry', () => {
        state.caseDetail.docketEntries = [MOCK_ANSWER];

        const { formattedDocketEntriesOnDocketRecord } = runCompute(
          publicCaseDetailHelper,
          { state },
        );

        expect(formattedDocketEntriesOnDocketRecord[0].hasDocument).toBe(true);
      });
    });

    describe('sealedToTooltip', () => {
      it('should compute sealedToTooltip value when the entry is sealed', () => {
        const mockSealedDocketEntry = {
          ...baseDocketEntry,
          isSealed: true,
          rootDocument: { documentType: 'Petition' },
          sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
          sealedToTooltip: undefined,
        };

        const result = formatDocketEntryOnDocketRecord(
          applicationContextPublic,
          {
            entry: mockSealedDocketEntry,
            isTerminalUser: false,
            visibilityPolicyDate: '',
          },
        );

        expect(result.sealedToTooltip).toBe('Sealed to the public');
      });

      it('should NOT compute sealedToTooltip value when the entry is NOT sealed', () => {
        const mockDocketEntry = {
          ...baseDocketEntry,
          isSealed: false,
          rootDocument: { documentType: 'Petition' },
          sealedToTooltip: undefined,
        };

        const result = formatDocketEntryOnDocketRecord(
          applicationContextPublic,
          {
            entry: mockDocketEntry,
            isTerminalUser: false,
            visibilityPolicyDate: '',
          },
        );

        expect(result.sealedToTooltip).toBe(undefined);
      });
    });

    describe('showLinkToDocument', () => {
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
            documentTitle:
              'Order of Dismissal and Decision Entered, Judge Buch',
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
            documentTitle:
              'Order of Dismissal and Decision Entered, Judge Buch',
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
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
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
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
          },
          {
            ...baseDocketEntry,
            docketEntryId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
            documentTitle:
              'Order of Dismissal and Decision Entered, Judge Buch',
            documentType: 'Order of Dismissal and Decision',
            eventCode: 'ODD',
            index: 3,
            isLegacyServed: true,
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
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
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
          },
          {
            ...baseDocketEntry,
            docketEntryId: 'a456c942-9d19-491a-b764-e2eac34205b0',
            documentTitle: 'Standing Pretrial Order',
            documentType: 'Standing Pretrial Order',
            eventCode: 'SPTO',
            index: 5,
            isLegacyServed: true,
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
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
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
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

      it('should not show a link for documents requested by a public user only', () => {
        state.caseDetail.docketEntries = [
          {
            ...baseDocketEntry,
            docketEntryId: '596223c1-527b-46b4-98b0-1b10455e9495',
            documentTitle: 'Decision Entered, Judge Buch Decision',
            documentType: 'Decision',
            eventCode: 'DEC',
            index: 1,
            isLegacyServed: true,
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
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
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
          },
          {
            ...baseDocketEntry,
            docketEntryId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
            documentTitle: 'Decision Entered, Judge Buch Another Decision',
            documentType: 'Decision',
            eventCode: 'DEC',
            index: 3,
            isLegacyServed: true,
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
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
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
          },
          {
            ...baseDocketEntry,
            docketEntryId: 'a456c942-9d19-491a-b764-e2eac34205b0',
            documentTitle: 'Standing Pretrial Order',
            documentType: 'Standing Pretrial Order',
            eventCode: 'SPTO',
            index: 5,
            isLegacyServed: true,
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
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
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
          },
        ];

        const result = runCompute(publicCaseDetailHelper, {
          state: { ...state, isTerminalUser: false },
        });

        expect(result.formattedDocketEntriesOnDocketRecord).toMatchObject([
          {
            descriptionDisplay: 'Decision Entered, Judge Buch Decision',
            docketEntryId: '596223c1-527b-46b4-98b0-1b10455e9495',
            eventCode: 'DEC',
            index: 1,
            openInSameTab: true,
            showLinkToDocument: true,
          },
          {
            descriptionDisplay:
              'Request for Place of Trial at San Francisco, California',
            docketEntryId: 'af6f67db-3160-4562-ac36-5481ab091952',
            eventCode: 'RQT',
            index: 2,
            openInSameTab: true,
            showLinkToDocument: false,
          },
          {
            descriptionDisplay: 'Decision Entered, Judge Buch Another Decision',
            docketEntryId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
            eventCode: 'DEC',
            index: 3,
            openInSameTab: true,
            showLinkToDocument: false,
          },
          {
            descriptionDisplay:
              'Notice of Trial on 12/30/2019 at San Francisco, California',
            docketEntryId: '162d3c72-2a31-4c66-b3f4-efaceb2cf0fd',
            eventCode: 'NTD', // not in EVENT_CODES_VISIBLE_TO_PUBLIC
            index: 4,
            openInSameTab: true,
            showLinkToDocument: false,
          },
          {
            descriptionDisplay: 'Standing Pretrial Order',
            docketEntryId: 'a456c942-9d19-491a-b764-e2eac34205b0',
            eventCode: 'SPTO',
            index: 5,
            openInSameTab: true,
            showLinkToDocument: true,
          },
          {
            descriptionDisplay: 'Standing Pretrial Order',
            docketEntryId: '71ac5f88-2316-4670-89bd-3decb99cf3ba',
            eventCode: 'SPTO',
            index: 6,
            openInSameTab: true,
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

      it('should show a link when the current document is a multi level ammendment whose root document is a brief', () => {
        state.caseDetail.docketEntries = [
          {
            attachments: false,
            certificateOfService: false,
            certificateOfServiceDate: null,
            docketEntryId: 'b22fd1a0-56cb-4873-bb4f-50df3a65da3f',
            docketNumber: '103-20',
            documentTitle:
              'Redacted First Supplement to Seriatim Answering Brief',
            documentType: 'Redacted',
            entityName: 'PublicDocketEntry',
            eventCode: 'REDC',
            filedBy: 'Petr. Reuben Blair',
            filedByRole: ROLES.privatePractitioner,
            filingDate: '2024-07-26T15:27:03.890Z',
            index: 9,
            isFileAttached: true,
            isMinuteEntry: false,
            isOnDocketRecord: true,
            isSealed: false,
            isStricken: false,
            numberOfPages: 2,
            previousDocument: {
              docketEntryId: 'ea55927d-f61a-4657-b828-3b8a9d9b9b70',
              documentTitle: 'First Supplement to Seriatim Answering Brief',
              documentType: 'Supplement',
              filedByRole: ROLES.privatePractitioner,
            },
            processingStatus: 'complete',
            receivedAt: '2023-07-26T04:00:00.000Z',
            servedAt: '2023-07-26T15:27:03.893Z',
            servedPartiesCode: 'B',
          },
          {
            attachments: false,
            certificateOfService: false,
            certificateOfServiceDate: null,
            docketEntryId: 'ea55927d-f61a-4657-b828-3b8a9d9b9b70',
            docketNumber: '103-20',
            documentTitle: 'First Supplement to Seriatim Answering Brief',
            documentType: 'Supplement',
            entityName: 'PublicDocketEntry',
            eventCode: 'SUPM',
            filedBy: 'Petr. Reuben Blair',
            filedByRole: ROLES.privatePractitioner,
            filingDate: '2024-07-26T15:26:33.586Z',
            index: 8,
            isFileAttached: true,
            isMinuteEntry: false,
            isOnDocketRecord: true,
            isSealed: false,
            isStricken: false,
            numberOfPages: 2,
            previousDocument: {
              docketEntryId: '8e3ae16b-dc29-433f-878a-7a0534c39919',
              documentTitle: 'Seriatim Answering Brief',
              documentType: 'Seriatim Answering Brief',
              filedByRole: ROLES.privatePractitioner,
            },
            processingStatus: 'complete',
            receivedAt: '2023-07-26T04:00:00.000Z',
            servedAt: '2023-07-26T15:26:33.591Z',
            servedPartiesCode: 'B',
          },
          {
            attachments: false,
            certificateOfService: false,
            certificateOfServiceDate: null,
            docketEntryId: '8e3ae16b-dc29-433f-878a-7a0534c39919',
            docketNumber: '103-20',
            documentTitle: 'Seriatim Answering Brief',
            documentType: 'Seriatim Answering Brief',
            entityName: 'PublicDocketEntry',
            eventCode: 'SEAB',
            filedBy: 'Petr. Reuben Blair',
            filedByRole: ROLES.privatePractitioner,
            filingDate: '2024-07-26T15:25:33.548Z',
            index: 7,
            isFileAttached: true,
            isMinuteEntry: false,
            isOnDocketRecord: true,
            isSealed: false,
            isStricken: false,
            numberOfPages: 2,
            processingStatus: 'complete',
            receivedAt: '2023-07-26T04:00:00.000Z',
            servedAt: '2023-07-26T15:25:33.550Z',
            servedPartiesCode: 'B',
          },
        ];

        const result = runCompute(publicCaseDetailHelper, { state });

        expect(
          result.formattedDocketEntriesOnDocketRecord[0].showLinkToDocument,
        ).toEqual(true);
      });

      it('should not display the document link when the entry is stricken and the user is the terminal user', () => {
        const result = formatDocketEntryOnDocketRecord(
          applicationContextPublic,
          {
            entry: {
              ...baseDocketEntry,
              filedByRole: ROLES.privatePractitioner,
              isStricken: true,
              rootDocument: { documentType: 'Petition' },
            },
            isTerminalUser: true,
            visibilityPolicyDate: '',
          },
        );

        expect(result.showLinkToDocument).toBe(false);
      });

      it('should show document link for a policy date impacted document for the terminal user when filed by practitioner after policy change date', () => {
        const { showLinkToDocument } = formatDocketEntryOnDocketRecord(
          applicationContextPublic,
          {
            entry: {
              ...baseDocketEntry,
              eventCode: POLICY_DATE_IMPACTED_EVENTCODES[0],
              filedByRole: ROLES.privatePractitioner,
              isCourtIssuedDocument: false,
              rootDocument: { documentType: 'Petition' },
              servedAt: '2012-05-16T00:00:00.000-04:00',
            },
            isTerminalUser: true,
            visibilityPolicyDate: '2010-05-16T00:00:00.000-04:00',
          },
        );

        expect(showLinkToDocument).toBe(true);
      });

      it('should show document link for brief for the terminal user when filed by practitioner before policy change date', () => {
        const { showLinkToDocument } = formatDocketEntryOnDocketRecord(
          applicationContextPublic,
          {
            entry: {
              ...baseDocketEntry,
              eventCode: POLICY_DATE_IMPACTED_EVENTCODES[0],
              filedByRole: ROLES.privatePractitioner,
              isCourtIssuedDocument: false,
              rootDocument: { documentType: 'Petition' },
              servedAt: '2040-05-16T00:00:00.000-04:00',
            },
            isTerminalUser: true,
            visibilityPolicyDate: '2040-05-16T00:00:00.000-04:00',
          },
        );

        expect(showLinkToDocument).toBe(true);
      });

      it('should show document link for a policy date impacted document when filed by practitioner after policy change date for the public user and is not a court issued document', () => {
        const { showLinkToDocument } = formatDocketEntryOnDocketRecord(
          applicationContextPublic,
          {
            entry: {
              ...baseDocketEntry,
              eventCode: POLICY_DATE_IMPACTED_EVENTCODES[0],
              filedByRole: ROLES.privatePractitioner,
              filingDate: '2030-05-16T00:00:00.000-04:00',
              isCourtIssuedDocument: false,
              rootDocument: { documentType: 'Petition' },
              servedAt: '2030-05-16T00:00:00.000-04:00',
            },
            isTerminalUser: false,
            visibilityPolicyDate: '2020-05-16T00:00:00.000-04:00',
          },
        );

        expect(showLinkToDocument).toBe(true);
      });

      it('should NOT show document link for a policy date impacted, court-issued stip decision when filed before policy change date for the public user', () => {
        const result = formatDocketEntryOnDocketRecord(
          applicationContextPublic,
          {
            entry: {
              ...baseDocketEntry,
              eventCode: STIPULATED_DECISION_EVENT_CODE,
              filedByRole: ROLES.privatePractitioner,
              filingDate: '2030-05-16T00:00:00.000-04:00',
              isCourtIssuedDocument: true,
              isNotServedDocument: false,
              isStipDecision: true,
              rootDocument: { documentType: 'Petition' },
            },
            isTerminalUser: false,
            visibilityPolicyDate: '2040-05-16T00:00:00.000-04:00',
          },
        );

        expect(result.showLinkToDocument).toBe(false);
      });

      it('should not show document link for a policy date impacted document when filed by practitioner before policy change date for the public user and is not a court issued document', () => {
        const result = formatDocketEntryOnDocketRecord(
          applicationContextPublic,
          {
            entry: {
              ...baseDocketEntry,
              eventCode: POLICY_DATE_IMPACTED_EVENTCODES[0],
              filedByRole: ROLES.privatePractitioner,
              filingDate: '2030-05-16T00:00:00.000-04:00',
              isCourtIssuedDocument: false,
              isNotServedDocument: false,
              rootDocument: { documentType: 'Petition' },
            },
            isTerminalUser: false,
            visibilityPolicyDate: '2040-05-16T00:00:00.000-04:00',
          },
        );

        expect(result.showLinkToDocument).toBe(false);
      });

      it('should NOT show document link for an amended brief when the docket entry was filed before visibility policy date (8/1/2023) by a practitioner on the case', () => {
        const result = formatDocketEntryOnDocketRecord(
          applicationContextPublic,
          {
            entry: {
              ...baseDocketEntry,
              eventCode: 'AMAT',
              filedByRole: ROLES.privatePractitioner,
              filingDate: '2020-05-16T00:00:00.000-04:00',
              isCourtIssuedDocument: false,
              isNotServedDocument: false,
              rootDocument: {
                docketEntryId: 'e86b58a8-aeb3-460e-af4b-3a31b6bae864',
                documentTitle: 'Seriatim Answering Memorandum Brief',
                documentType: 'Seriatim Answering Memorandum Brief',
              },
            },
            isTerminalUser: false,
            visibilityPolicyDate: '2023-08-01T00:00:00.000-04:00',
          },
        );

        expect(result.showLinkToDocument).toBe(false);
      });

      it('should show document link for an amended brief when the docket entry was filed after the visibility policy date (8/1/2023) by a practitioner on the case', () => {
        const { showLinkToDocument } = formatDocketEntryOnDocketRecord(
          applicationContextPublic,
          {
            entry: {
              ...baseDocketEntry,
              eventCode: 'AMAT',
              filedByRole: ROLES.privatePractitioner,
              filingDate: '2050-05-16T00:00:00.000-04:00',
              isCourtIssuedDocument: false,
              rootDocument: {
                docketEntryId: 'e86b58a8-aeb3-460e-af4b-3a31b6bae864',
                documentTitle: 'Seriatim Answering Memorandum Brief',
                documentType: 'Seriatim Answering Memorandum Brief',
                filedByRole: ROLES.privatePractitioner,
              },
              servedAt: '2050-05-16T00:00:00.000-04:00',
            },
            isTerminalUser: false,
            visibilityPolicyDate: '2023-08-01T00:00:00.000-04:00',
          },
        );

        expect(showLinkToDocument).toBe(true);
      });

      it('should NOT show document link for an amendment docket entry when the previous docket entry is NOT a brief', () => {
        const result = formatDocketEntryOnDocketRecord(
          applicationContextPublic,
          {
            entry: {
              ...baseDocketEntry,
              eventCode: 'AMAT',
              filedByRole: ROLES.privatePractitioner,
              filingDate: '2050-05-16T00:00:00.000-04:00',
              isCourtIssuedDocument: false,
              isNotServedDocument: false,
              rootDocument: {
                docketEntryId: baseDocketEntry.docketEntryId,
                documentTitle: 'Petition',
                documentType: 'Petition',
              },
            },
            isTerminalUser: false,
            visibilityPolicyDate: '2023-08-01T00:00:00.000-04:00',
          },
        );

        expect(result.showLinkToDocument).toBe(false);
      });

      it('should show document link for a Stipulated Decision (SDEC)', () => {
        const result = formatDocketEntryOnDocketRecord(
          applicationContextPublic,
          {
            entry: {
              ...stipDecisionDocument,
              filedByRole: ROLES.docketClerk,
              rootDocument: { documentType: 'Petition' },
            },
            isTerminalUser: false,
            visibilityPolicyDate: '2023-08-01T00:00:00.000-04:00',
          },
        );

        expect(result.showLinkToDocument).toBe(true);
      });

      it('should NOT show a document link for an amended brief entry when the document was not filed by a practitioner on the case', () => {
        const result = formatDocketEntryOnDocketRecord(
          applicationContextPublic,
          {
            entry: {
              ...baseDocketEntry,
              eventCode: 'AMAT',
              filedByRole: ROLES.docketClerk,
              filingDate: '2050-05-16T00:00:00.000-04:00',
              isCourtIssuedDocument: false,
              isNotServedDocument: false,
              rootDocument: {
                docketEntryId: baseDocketEntry.docketEntryId,
                documentTitle: 'Seriatim Answering Memorandum Brief',
                documentType: 'Seriatim Answering Memorandum Brief',
              },
            },
            isTerminalUser: false,
            visibilityPolicyDate: '2023-08-01T00:00:00.000-04:00',
          },
        );

        expect(result.showLinkToDocument).toBe(false);
      });

      it('should show a document link for an amended amicus brief when the document was filed after the visibility policy date (8/1/2023)', () => {
        const { showLinkToDocument } = formatDocketEntryOnDocketRecord(
          applicationContextPublic,
          {
            entry: {
              ...baseDocketEntry,
              eventCode: 'AMAT',
              filedByRole: ROLES.docketClerk,
              filingDate: '2050-05-16T00:00:00.000-04:00',
              isCourtIssuedDocument: false,
              rootDocument: {
                documentTitle: 'Amicus Brief',
                documentType: AMICUS_BRIEF_DOCUMENT_TYPE,
                eventCode: AMICUS_BRIEF_EVENT_CODE,
                filedByRole: ROLES.docketClerk,
              },
              servedAt: '2050-05-16T00:00:00.000-04:00',
            },
            isTerminalUser: false,
            visibilityPolicyDate: '2023-08-01T00:00:00.000-04:00',
          },
        );

        expect(showLinkToDocument).toBe(true);
      });

      it('should show a document link for a redacted amicus brief when the document was filed after the visibility policy date (8/1/2023)', () => {
        const { showLinkToDocument } = formatDocketEntryOnDocketRecord(
          applicationContextPublic,
          {
            entry: {
              ...baseDocketEntry,
              eventCode: 'REDC',
              filedByRole: ROLES.privatePractitioner,
              filingDate: '2050-05-16T00:00:00.000-04:00',
              isCourtIssuedDocument: false,
              rootDocument: {
                documentTitle: 'Amicus Brief',
                documentType: AMICUS_BRIEF_DOCUMENT_TYPE,
                eventCode: AMICUS_BRIEF_EVENT_CODE,
                filedByRole: ROLES.docketClerk,
              },
              servedAt: '2050-05-16T00:00:00.000-04:00',
            },
            isTerminalUser: false,
            visibilityPolicyDate: '2023-08-01T00:00:00.000-04:00',
          },
        );

        expect(showLinkToDocument).toBe(true);
      });
    });
  });

  describe('isCaseSealed', () => {});

  describe('showPrintableDocketRecord', () => {
    it('should show printable docket record button if canAllowPrintableDocketRecord is true', () => {
      const result = runCompute(publicCaseDetailHelper, {
        state: {
          caseDetail: {
            canAllowPrintableDocketRecord: true,
            docketEntries: [],
          },
          sessionMetadata: {
            docketRecordFilter:
              PUBLIC_DOCKET_RECORD_FILTER_OPTIONS.allDocuments,
            docketRecordSort: {},
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
          sessionMetadata: {
            docketRecordFilter:
              PUBLIC_DOCKET_RECORD_FILTER_OPTIONS.allDocuments,
            docketRecordSort: {},
          },
        },
      });
      expect(result.showPrintableDocketRecord).toBeFalsy();
    });
  });
});

describe('formatDocketEntryOnDocketRecord', () => {
  let state;

  const publicCaseDetailHelper = withAppContextDecorator(
    publicCaseDetailHelperComputed,
    applicationContextPublic,
  );

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
      sessionMetadata: {
        docketRecordFilter: PUBLIC_DOCKET_RECORD_FILTER_OPTIONS.allDocuments,
        docketRecordSort: {},
      },
    };
  });

  it('should set servedAtFormatted when the servedAt property is set', () => {
    const { servedAtFormatted } = formatDocketEntryOnDocketRecord(
      applicationContextPublic,
      {
        entry: {
          ...baseDocketEntry,
          servedAt: '2012-05-16T00:00:00.000-04:00',
        },
        isTerminalUser: true,
        visibilityPolicyDate: '2010-05-16T00:00:00.000-04:00',
      },
    );

    expect(servedAtFormatted).toBe('05/16/12');
  });

  it('should set showNotServed to true when the docket entry can be served and it has not yet been', () => {
    const { showNotServed } = formatDocketEntryOnDocketRecord(
      applicationContextPublic,
      {
        entry: {
          ...baseDocketEntry,
          eventCode: 'O',
          servedAt: undefined,
        },
        isTerminalUser: true,
        visibilityPolicyDate: '2010-05-16T00:00:00.000-04:00',
      },
    );

    expect(showNotServed).toBe(true);
  });

  it('should set showNotServed to false when the docket entry is unservable', () => {
    const { showNotServed } = formatDocketEntryOnDocketRecord(
      applicationContextPublic,
      {
        entry: {
          ...baseDocketEntry,
          eventCode: UNSERVABLE_EVENT_CODES[0],
          servedAt: undefined,
        },
        isTerminalUser: true,
        visibilityPolicyDate: '2010-05-16T00:00:00.000-04:00',
      },
    );

    expect(showNotServed).toBe(false);
  });

  it('should return formatted docket entry', () => {
    state.caseDetail.docketEntries = [
      {
        ...baseDocketEntry,
        action: 'something',
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
        descriptionDisplay: 'Petition (Attachment(s))',
        docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
        eventCode: 'P',
        index: 4,
        servedPartiesCode: PARTIES_CODES.RESPONDENT,
        showDocumentDescriptionWithoutLink: true,
        showLinkToDocument: false,
        showNotServed: true,
        showServed: false,
      },
    ]);
  });
});
