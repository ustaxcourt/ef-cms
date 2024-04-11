/* eslint-disable max-lines */

import {
  ALLOWLIST_FEATURE_FLAGS,
  DOCKET_ENTRY_SEALED_TO_TYPES,
  DOCKET_RECORD_FILTER_OPTIONS,
  ROLES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  docketClerkUser,
  petitionerUser,
  petitionsClerkUser,
} from '../../../../shared/src/test/mockUsers';
import {
  formattedDocketEntries as formattedDocketEntriesComputed,
  setupIconsToDisplay,
} from './formattedDocketEntries';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('formattedDocketEntries', () => {
  const getDateISO = () =>
    applicationContext.getUtilities().createISODateString();

  const mockDocketEntry = {
    createdAt: getDateISO(),
    docketEntryId: '123',
    documentTitle: 'Petition',
    filedBy: 'Jessica Frase Marine',
    filingDate: '2019-02-28T21:14:39.488Z',
    index: 0,
    isOnDocketRecord: true,
  };

  const { DOCUMENT_PROCESSING_STATUS_OPTIONS } =
    applicationContext.getConstants();

  const formattedDocketEntries = withAppContextDecorator(
    formattedDocketEntriesComputed,
    {
      ...applicationContext,
      getCurrentUser: () => {
        return globalUser;
      },
    },
  );

  const getBaseState = user => {
    globalUser = user;
    return {
      documentsSelectedForDownload: [],
      featureFlags: {
        [ALLOWLIST_FEATURE_FLAGS.DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE.key]:
          '2023-05-01',
      },
      permissions: getUserPermissions(user),
      sessionMetadata: {
        docketRecordFilter: DOCKET_RECORD_FILTER_OPTIONS.allDocuments,
      },
    };
  };

  let globalUser;

  it('does not error and returns expected empty values on empty caseDetail', () => {
    const result = runCompute(formattedDocketEntries, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: {
          docketEntries: [],
        },
      },
    });

    expect(result).toMatchObject({
      formattedDocketEntries: [],
    });
  });

  it('maps docket record dates', () => {
    const result = runCompute(formattedDocketEntries, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: { ...MOCK_CASE, docketEntries: [mockDocketEntry] },
      },
    });

    expect(
      result.formattedDocketEntriesOnDocketRecord[0].createdAtFormatted,
    ).toEqual('02/28/19');
  });

  it('maps docket record documents', () => {
    const result = runCompute(formattedDocketEntries, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: { ...MOCK_CASE, docketEntries: [mockDocketEntry] },
      },
    });
    expect(
      result.formattedDocketEntriesOnDocketRecord[0].docketEntryId,
    ).toEqual('123');
  });

  it('should set the correct text and tooltip for the seal button when the docket entry is not sealed', () => {
    const result = runCompute(formattedDocketEntries, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: {
          ...MOCK_CASE,
          docketEntries: [
            {
              ...mockDocketEntry,
              isSealed: false,
            },
          ],
        },
      },
    });
    expect(result.formattedDocketEntriesOnDocketRecord[0]).toMatchObject({
      sealButtonText: 'Seal',
      sealButtonTooltip: 'Seal to the public',
    });
  });

  it('should set the correct text and tooltip for the seal button when the docket entry is sealed to public', () => {
    const result = runCompute(formattedDocketEntries, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: {
          ...MOCK_CASE,
          docketEntries: [
            {
              ...mockDocketEntry,
              isSealed: true,
              sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
            },
          ],
        },
      },
    });
    expect(result.formattedDocketEntriesOnDocketRecord[0]).toMatchObject({
      sealButtonText: 'Unseal',
      sealButtonTooltip: 'Unseal to the public',
    });
  });

  it('should set the correct text and tooltip for the seal button when the docket entry is sealed to external', () => {
    const result = runCompute(formattedDocketEntries, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: {
          ...MOCK_CASE,
          docketEntries: [
            {
              ...mockDocketEntry,
              isSealed: true,
              sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL,
            },
          ],
        },
      },
    });
    expect(result.formattedDocketEntriesOnDocketRecord[0]).toMatchObject({
      sealButtonText: 'Unseal',
      sealButtonTooltip: 'Unseal to the public and parties of this case',
    });
  });

  it('should set the seal icon to an unlock icon when the docket entry is sealed', () => {
    const result = runCompute(formattedDocketEntries, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: {
          ...MOCK_CASE,
          docketEntries: [
            {
              ...mockDocketEntry,
              isSealed: true,
              sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL,
            },
          ],
        },
      },
    });
    expect(result.formattedDocketEntriesOnDocketRecord[0]).toMatchObject({
      sealIcon: 'unlock',
    });
  });

  it('should set the seal icon to an lock icon when the docket entry is unsealed', () => {
    const result = runCompute(formattedDocketEntries, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: {
          ...MOCK_CASE,
          docketEntries: [
            {
              ...mockDocketEntry,
              isSealed: false,
            },
          ],
        },
      },
    });
    expect(result.formattedDocketEntriesOnDocketRecord[0]).toMatchObject({
      sealIcon: 'lock',
    });
  });

  it('returns editDocketEntryMetaLinks with formatted docket entries', () => {
    const result = runCompute(formattedDocketEntries, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: { ...MOCK_CASE, docketEntries: [mockDocketEntry] },
      },
    });

    expect(result.formattedDocketEntriesOnDocketRecord).toMatchObject([
      {
        editDocketEntryMetaLink: `/case-detail/${MOCK_CASE.docketNumber}/docket-entry/${mockDocketEntry.index}/edit-meta`,
      },
    ]);
  });

  it('formats descriptionDisplay for `OCS` type documents correctly', () => {
    const result = runCompute(formattedDocketEntries, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: {
          ...MOCK_CASE,
          docketEntries: [
            {
              docketEntryId: 'd-1-2-3',
              documentTitle: 'Online Cited Source',
              documentType: 'Online Cited Source',
              eventCode: 'OCS',
              freeText: 'Test site viewed on 09/09/22',
              isOnDocketRecord: true,
            },
          ],
        },
      },
    });

    expect(result.formattedDocketEntriesOnDocketRecord).toMatchObject([
      {
        descriptionDisplay:
          'Test site viewed on 09/09/22 - Online Cited Source',
        docketEntryId: 'd-1-2-3',
        documentType: 'Online Cited Source',
        isCourtIssuedDocument: true,
        isInProgress: false,
        isPetition: false,
        isStatusServed: false,
      },
    ]);
  });

  it('should NOT show document link for an amendment petition docket entry when the previous docket entry is NOT a brief', () => {
    const result = runCompute(formattedDocketEntries, {
      state: {
        ...getBaseState(petitionerUser),
        caseDetail: {
          ...MOCK_CASE,
          docketEntries: [
            {
              ...mockDocketEntry,
              eventCode: 'AMAT',
              filingDate: '2050-05-16T00:00:00.000-04:00',
              isCourtIssuedDocument: false,
              isFileAttached: true,
              previousDocument: {
                docketEntryId: '0f52c863-6702-4243-9ea7-e0af17294067',
                documentTitle: 'Petition',
                documentType: 'Petition',
              },
              servedAt: '2050-05-16T00:00:00.000-04:01',
            },
            {
              ...mockDocketEntry,
              docketEntryId: '0f52c863-6702-4243-9ea7-e0af17294067',
              eventCode: 'P',
              filingDate: '2050-05-16T00:00:00.000-04:00',
              isCourtIssuedDocument: false,
              isFileAttached: true,
              servedAt: '2050-05-16T00:00:00.000-04:01',
            },
          ],
        },
      },
    });

    const amat = result.formattedDocketEntriesOnDocketRecord.find(
      document => document.docketEntryId === mockDocketEntry.docketEntryId,
    );

    expect(amat.showLinkToDocument).toEqual(false);
  });

  it('should show document link for an amendment docket entry when the previous docket entry is a brief and filed after visibility policy change date', () => {
    const result = runCompute(formattedDocketEntries, {
      state: {
        ...getBaseState(petitionerUser),
        caseDetail: {
          ...MOCK_CASE,
          docketEntries: [
            {
              ...mockDocketEntry,
              eventCode: 'AMAT',
              filedByRole: ROLES.privatePractitioner,
              filingDate: '2050-05-16T00:00:00.000-04:00',
              isCourtIssuedDocument: false,
              isFileAttached: true,
              previousDocument: {
                docketEntryId: '0f52c863-6702-4243-9ea7-e0af17294067',
                documentTitle: 'Seriatim Answering Brief',
                documentType: 'Seriatim Answering Brief',
              },
              servedAt: '2050-05-16T00:00:00.000-04:01',
            },
            {
              ...mockDocketEntry,
              docketEntryId: '0f52c863-6702-4243-9ea7-e0af17294067',
              documentType: 'Seriatim Answering Brief',
              eventCode: 'SEAB',
              filingDate: '2050-05-16T00:00:00.000-04:00',
              isCourtIssuedDocument: false,
              isFileAttached: true,
              servedAt: '2050-05-16T00:00:00.000-04:01',
            },
          ],
        },
      },
    });

    const amat = result.formattedDocketEntriesOnDocketRecord.find(
      document => document.docketEntryId === mockDocketEntry.docketEntryId,
    );

    expect(amat.showLinkToDocument).toEqual(true);
  });

  it('should mark the document selected when it is selected', () => {
    const result = runCompute(formattedDocketEntries, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: {
          ...MOCK_CASE,
          docketEntries: [
            {
              ...mockDocketEntry,
              isFileAttached: true,
            },
          ],
        },
        documentsSelectedForDownload: [
          { docketEntryId: mockDocketEntry.docketEntryId },
        ],
      },
    });
    expect(result.formattedDocketEntriesOnDocketRecord[0]).toMatchObject({
      isDocumentSelected: true,
    });
  });

  it('should mark some documents selected when more than one but not all are selected', () => {
    const result = runCompute(formattedDocketEntries, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: {
          ...MOCK_CASE,
          docketEntries: [
            {
              ...mockDocketEntry,
              isFileAttached: true,
            },
            {
              ...mockDocketEntry,
              docketEntryId: 'some other docketEntry ID',
              isFileAttached: true,
            },
          ],
        },
        documentsSelectedForDownload: [
          { docketEntryId: mockDocketEntry.docketEntryId },
        ],
      },
    });
    expect(result).toMatchObject({
      allDocumentsSelectedForDownload: false,
      isDownloadLinkEnabled: true,
      someDocumentsSelectedForDownload: true,
    });
  });

  it('should mark all documents selected when all are selected', () => {
    const result = runCompute(formattedDocketEntries, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: {
          ...MOCK_CASE,
          docketEntries: [
            {
              ...mockDocketEntry,
              isFileAttached: true,
            },
            {
              ...mockDocketEntry,
              docketEntryId: 'some other docketEntry ID',
              isFileAttached: true,
            },
          ],
        },
        documentsSelectedForDownload: [
          { docketEntryId: mockDocketEntry.docketEntryId },
          { docketEntryId: 'some other docketEntry ID' },
        ],
      },
    });
    expect(result).toMatchObject({
      allDocumentsSelectedForDownload: true,
      isDownloadLinkEnabled: true,
      someDocumentsSelectedForDownload: false,
    });
  });

  it('should leave the download link disabled if no documents are selected for download', () => {
    const result = runCompute(formattedDocketEntries, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: {
          ...MOCK_CASE,
          docketEntries: [
            {
              ...mockDocketEntry,
              isFileAttached: true,
            },
            {
              ...mockDocketEntry,
              docketEntryId: 'some other docketEntry ID',
              isFileAttached: true,
            },
          ],
        },
        documentsSelectedForDownload: [],
      },
    });
    expect(result).toMatchObject({
      allDocumentsSelectedForDownload: false,
      isDownloadLinkEnabled: false,
      someDocumentsSelectedForDownload: false,
    });
  });

  it('should keep track of which documents on the docket entry are eligible to be downloaded', () => {
    const result = runCompute(formattedDocketEntries, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: {
          ...MOCK_CASE,
          docketEntries: [
            {
              ...mockDocketEntry,
              docketEntryId: 'petition, eligible',
              isFileAttached: true,
            },
            {
              ...mockDocketEntry,
              docketEntryId: 'minute entry, ineligible',
              eventCode: 'FEE',
              isFileAttached: false,
            },
            {
              ...mockDocketEntry,
              docketEntryId: 'stin, eligible',
              isFileAttached: true,
            },
          ],
        },
        documentsSelectedForDownload: [],
      },
    });
    expect(result).toMatchObject({
      allEligibleDocumentsForDownload: [
        { docketEntryId: 'petition, eligible' },
        { docketEntryId: 'stin, eligible' },
      ],
    });
  });

  describe('sorts docket records', () => {
    let sortedCaseDetail;

    beforeAll(() => {
      sortedCaseDetail = {
        ...MOCK_CASE,
        docketEntries: [
          {
            createdAt: '2019-02-28T21:14:39.488Z',
            docketEntryId: 'Petition',
            documentTitle: 'Petition',
            documentType: 'Petition',
            filingDate: '2019-01-28T21:10:55.488Z',
            index: 1,
            isOnDocketRecord: true,
          },
          {
            docketEntryId: 'Request for Place of Trial',
            documentTitle: 'Request for Place of Trial',
            filingDate: '2019-01-28T21:10:33.488Z',
            index: 2,
            isOnDocketRecord: true,
          },
          {
            createdAt: '2019-03-28T21:14:39.488Z',
            docketEntryId: 'Corporate Disclosure Statement',
            documentTitle: 'Corporate Disclosure Statement',
            documentType: 'Corporate Disclosure Statement',
            filingDate: '2019-03-28T21:14:39.488Z',
            index: 4,
            isOnDocketRecord: true,
          },
          {
            createdAt: '2019-01-01T21:14:39.488Z',
            docketEntryId: 'Other',
            documentTitle: 'Other',
            documentType: 'Other',
            filingDate: '2019-01-28',
            index: 3,
            isOnDocketRecord: true,
          },
        ],
      };
    });

    it('sorts the docket record in the expected default order (ascending date)', () => {
      const result = runCompute(formattedDocketEntries, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: sortedCaseDetail,
        },
      });

      expect(result.formattedDocketEntriesOnDocketRecord).toMatchObject([
        { documentType: 'Petition' },
        { documentTitle: 'Request for Place of Trial' },
        { documentType: 'Other' },
        { documentType: 'Corporate Disclosure Statement' },
      ]);
    });
  });

  describe('draft documents', () => {
    it('formats draft documents', () => {
      const result = runCompute(formattedDocketEntries, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...MOCK_CASE,
            docketEntries: [
              {
                archived: false,
                createdAt: '2019-02-28T21:14:39.488Z',
                docketEntryId: 'd-1-2-3',
                documentTitle: 'Order to do something',
                documentType: 'Order',
                eventCode: 'O',
                isDraft: true,
                isOnDocketRecord: false,
              },
            ],
          },
        },
      });

      expect(result.formattedDraftDocuments).toMatchObject([
        {
          createdAtFormatted: '02/28/19',
          descriptionDisplay: 'Order to do something',
          docketEntryId: 'd-1-2-3',
          documentType: 'Order',
          isCourtIssuedDocument: true,
          isInProgress: false,
          isNotServedDocument: true,
          isPetition: false,
          isStatusServed: false,
          showDocumentViewerLink: true,
          signedAtFormatted: '',
          signedAtFormattedTZ: '',
        },
      ]);
    });

    it("doesn't format draft documents if there are none", () => {
      const result = runCompute(formattedDocketEntries, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...MOCK_CASE,
            docketEntries: [],
          },
        },
      });

      expect(result.formattedDraftDocuments).toEqual([]);
    });
  });

  describe('stricken docket record', () => {
    const docketEntries = [
      {
        ...mockDocketEntry,
        documentTitle: 'Motion to Dismiss for Lack of Jurisdiction',
        documentType: 'Motion to Dismiss for Lack of Jurisdiction',
        eventCode: 'M073',
        isFileAttached: true,
        isLegacy: true,
        isStricken: true,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      },
    ];

    it('should not show the link to an external user for a document with a stricken docket record', () => {
      const result = runCompute(formattedDocketEntries, {
        state: {
          ...getBaseState(petitionerUser),
          caseDetail: {
            ...MOCK_CASE,
            docketEntries,
          },
        },
      });

      expect(result.formattedDocketEntriesOnDocketRecord[0]).toMatchObject({
        isStricken: true,
        showDocumentDescriptionWithoutLink: true,
        showDocumentViewerLink: false,
        showLinkToDocument: false,
      });
    });

    it('should show the link to an associated external user when the document has isLegacyServed true and servedAt undefined', () => {
      const result = runCompute(formattedDocketEntries, {
        state: {
          ...getBaseState(petitionerUser),
          caseDetail: {
            docketEntries: [
              {
                ...docketEntries[0],
                isLegacyServed: true,
                isMinuteEntry: false,
                isOnDocketRecord: true,
                isStricken: false,
              },
            ],
          },
          screenMetadata: {
            isAssociated: true,
          },
        },
      });

      expect(result.formattedDocketEntriesOnDocketRecord[0]).toMatchObject({
        isLegacyServed: true,
        showDocumentDescriptionWithoutLink: false,
        showDocumentViewerLink: false,
        showLinkToDocument: true,
      });
    });

    it('should NOT show the link to an associated external user when the document has isLegacyServed undefined and servedAt undefined', () => {
      const result = runCompute(formattedDocketEntries, {
        state: {
          ...getBaseState(petitionerUser),
          caseDetail: {
            docketEntries: [
              {
                ...docketEntries[0],
                isMinuteEntry: false,
                isOnDocketRecord: true,
                isStricken: false,
              },
            ],
          },
          screenMetadata: {
            isAssociated: true,
          },
        },
      });

      expect(result.formattedDocketEntriesOnDocketRecord[0]).toMatchObject({
        showDocumentDescriptionWithoutLink: true,
        showDocumentViewerLink: false,
        showLinkToDocument: false,
      });
    });

    it('should NOT show the link to an associated external user when the document is sealed to external users', () => {
      const result = runCompute(formattedDocketEntries, {
        state: {
          ...getBaseState(petitionerUser),
          caseDetail: {
            docketEntries: [
              {
                ...docketEntries[0],
                isSealed: true,
                isStricken: false,
                sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL,
              },
            ],
          },
          screenMetadata: {
            isAssociated: true,
          },
        },
      });

      expect(result.formattedDocketEntriesOnDocketRecord[0]).toMatchObject({
        showDocumentDescriptionWithoutLink: true,
        showDocumentViewerLink: false,
        showLinkToDocument: false,
      });
    });

    it('should show the link to an internal user for a document with a stricken docket record', () => {
      const result = runCompute(formattedDocketEntries, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: { ...MOCK_CASE, docketEntries },
        },
      });

      expect(result.formattedDocketEntriesOnDocketRecord[0]).toMatchObject({
        isStricken: true,
        showDocumentDescriptionWithoutLink: false,
        showDocumentViewerLink: true,
        showLinkToDocument: false,
      });
    });
  });

  describe('formattedDocketEntriesOnDocketRecord and formattedPendingDocketEntriesOnDocketRecord', () => {
    const mockDocketEntries = [
      {
        ...mockDocketEntry,
        docketEntryId: '402ccc12-72c0-481e-b3f2-44debcd167a4',
        documentTitle: 'Exhibit for Noodles',
        eventCode: 'EXH',
      },
      {
        ...mockDocketEntry,
        docketEntryId: '402ccc12-72c0-481e-b3f2-44debcd167a4',
        documentTitle: 'Order in the Court',
        eventCode: 'O',
      },
      {
        ...mockDocketEntry,
        docketEntryId: '402ccc12-72c0-481e-b3f2-44debcd167a4',
        documentTitle: 'Motion in the Ocean',
        eventCode: 'M000',
      },
    ];
    it('should return formatted docket entries that are on the docket record, and in the pending list', () => {
      const caseDetail = {
        ...MOCK_CASE,
        docketEntries: [
          {
            ...mockDocketEntry,
            docketEntryId: '402ccc12-72c0-481e-b3f2-44debcd167a4',
            documentTitle: 'Proposed Stipulated Decision',
            documentType: 'Proposed Stipulated Decision',
            eventCode: 'PSDE',
            index: 3,
            isFileAttached: true,
            isMinuteEntry: false,
            isOnDocketRecord: true,
            isStricken: false,
            pending: true,
            servedAt: '2020-09-18T17:38:32.418Z',
            servedParties: [
              { email: 'petitioner@example.com', name: 'Mona Schultz' },
            ],
          },
        ],
      };

      const result = runCompute(formattedDocketEntries, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
        },
      });

      expect(result.formattedPendingDocketEntriesOnDocketRecord.length).toEqual(
        1,
      );
      expect(result.formattedPendingDocketEntriesOnDocketRecord).toMatchObject([
        {
          eventCode: 'PSDE',
          isOnDocketRecord: true,
          pending: true,
        },
      ]);
    });

    it('should ONLY show exhibit docket entries when "Exhibits" has been selected as the filter', () => {
      const caseDetail = {
        ...MOCK_CASE,
        docketEntries: mockDocketEntries,
      };

      const result = runCompute(formattedDocketEntries, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          sessionMetadata: {
            docketRecordFilter: DOCKET_RECORD_FILTER_OPTIONS.exhibits,
          },
        },
      });

      expect(result.formattedDocketEntriesOnDocketRecord.length).toBe(1);
      expect(result.formattedDocketEntriesOnDocketRecord[0].eventCode).toBe(
        'EXH',
      );
    });

    it('should ONLY show order type docket entries when "Orders" has been selected as the filter', () => {
      const caseDetail = {
        ...MOCK_CASE,
        docketEntries: mockDocketEntries,
      };

      const result = runCompute(formattedDocketEntries, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          sessionMetadata: {
            docketRecordFilter: DOCKET_RECORD_FILTER_OPTIONS.orders,
          },
        },
      });

      expect(result.formattedDocketEntriesOnDocketRecord.length).toBe(1);
      expect(result.formattedDocketEntriesOnDocketRecord[0].eventCode).toBe(
        'O',
      );
    });

    it('should ONLY show motion type docket entries when "Motions" has been selected as the filter', () => {
      const caseDetail = {
        ...MOCK_CASE,
        docketEntries: mockDocketEntries,
      };

      const result = runCompute(formattedDocketEntries, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          sessionMetadata: {
            docketRecordFilter: DOCKET_RECORD_FILTER_OPTIONS.motions,
          },
        },
      });

      expect(result.formattedDocketEntriesOnDocketRecord.length).toBe(1);
      expect(result.formattedDocketEntriesOnDocketRecord[0].eventCode).toBe(
        'M000',
      );
    });

    it('should show all docket entries when "All documents" has been selected as the filter', () => {
      const caseDetail = {
        ...MOCK_CASE,
        docketEntries: [
          {
            ...mockDocketEntry,
            docketEntryId: '402ccc12-72c0-481e-b3f2-44debcd167a4',
            documentTitle: 'Order in the Court',
            eventCode: 'O',
          },
          {
            ...mockDocketEntry,
            docketEntryId: '402ccc12-72c0-481e-b3f2-44debcd167a4',
            documentTitle: 'Exhibit for Noodles',
            eventCode: 'EXH',
          },
        ],
      };

      const result = runCompute(formattedDocketEntries, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
        },
      });

      expect(result.formattedDocketEntriesOnDocketRecord.length).toBe(2);
    });
  });

  describe('qcNeeded', () => {
    it('should set qcNeeded to true when work item is not read', () => {
      const result = runCompute(formattedDocketEntries, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...mockDocketEntry,
                workItem: {
                  completedAt: undefined,
                  isRead: false,
                },
              },
            ],
          },
        },
      });

      expect(result.formattedDocketEntriesOnDocketRecord[0]).toMatchObject({
        qcNeeded: true,
      });
    });

    it('should set qcNeeded to false when qcWorkItemsUntouched is true and work item is read', () => {
      const result = runCompute(formattedDocketEntries, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...mockDocketEntry,
                workItem: {
                  completedAt: '2020-04-29T15:51:29.168Z',
                  isRead: true,
                },
              },
            ],
          },
        },
      });

      expect(result.formattedDocketEntriesOnDocketRecord[0]).toMatchObject({
        qcNeeded: false,
      });
    });
  });

  describe('sealedTo', () => {
    it('should set the tooltip correctly when the docket entry is sealed', () => {
      const result = runCompute(formattedDocketEntries, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...mockDocketEntry,
                isSealed: true,
                sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
                sealedToTooltip: undefined,
              },
            ],
          },
        },
      });

      expect(
        result.formattedDocketEntriesOnDocketRecord[0].sealedToTooltip,
      ).toBeDefined();
    });
  });

  describe('setupIconsToDisplay', () => {
    it('should return a lock icon with formatted tooltip text when the docket entry has been sealed', () => {
      const result = setupIconsToDisplay({
        formattedResult: {
          ...mockDocketEntry,
          sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL,
          sealedToTooltip: 'anything',
        },
        isExternalUser: false,
      });

      expect(result).toEqual([
        {
          className: 'sealed-docket-entry',
          icon: 'lock',
          title: expect.anything(),
        },
      ]);
    });

    it('should return only the paper icon if isPaper is true', () => {
      const result = setupIconsToDisplay({
        formattedResult: {
          ...mockDocketEntry,
          isPaper: true,
          qcNeeded: true,
          showLoadingIcon: true,
        },
        isExternalUser: false,
      });

      expect(result).toEqual([
        {
          icon: ['fas', 'file-alt'],
          title: 'is paper',
        },
      ]);
    });

    it('should only return the isInProgress icon if isInProgress is true', () => {
      const result = setupIconsToDisplay({
        formattedResult: {
          ...mockDocketEntry,
          isInProgress: true,
          isPaper: false,
          qcNeeded: true,
        },
        isExternalUser: false,
      });

      expect(result).toEqual([
        {
          icon: ['fas', 'thumbtack'],
          title: 'in progress',
        },
      ]);
    });

    it('should only return the qcNeeded icon if qcNeeded is true', () => {
      const result = setupIconsToDisplay({
        formattedResult: {
          ...mockDocketEntry,
          qcNeeded: true,
          showLoadingIcon: true,
        },
        isExternalUser: false,
      });

      expect(result).toEqual([
        {
          icon: ['fa', 'star'],
          title: 'is untouched',
        },
      ]);
    });

    it('should only return the showLoadingIcon icon if showLoadingIcon is true', () => {
      const result = setupIconsToDisplay({
        formattedResult: {
          ...mockDocketEntry,
          showLoadingIcon: true,
        },
        isExternalUser: false,
      });

      expect(result).toEqual([
        {
          className: 'fa-spin spinner',
          icon: ['fa-spin', 'spinner'],
          title: 'is loading',
        },
      ]);
    });
  });
});
