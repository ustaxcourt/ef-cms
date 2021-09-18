import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import {
  docketClerkUser,
  petitionerUser,
  petitionsClerkUser,
} from '../../../../shared/src/test/mockUsers';
import { formattedDocketEntries as formattedDocketEntriesComputed } from './formattedDocketEntries';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const getDateISO = () =>
  applicationContext.getUtilities().createISODateString();

export const mockDocketEntry = {
  createdAt: getDateISO(),
  docketEntryId: '123',
  documentTitle: 'Petition',
  filedBy: 'Jessica Frase Marine',
  filingDate: '2019-02-28T21:14:39.488Z',
  isOnDocketRecord: true,
};

describe('formattedDocketEntries', () => {
  let globalUser;
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
      permissions: getUserPermissions(user),
    };
  };

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
            docketEntryId: 'Ownership Disclosure Statement',
            documentTitle: 'Ownership Disclosure Statement',
            documentType: 'Ownership Disclosure Statement',
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
        { documentType: 'Ownership Disclosure Statement' },
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
          signedAtFormatted: undefined,
          signedAtFormattedTZ: undefined,
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

    it('should not show the link to an associated external user when the document has isLegacySealed true', () => {
      const result = runCompute(formattedDocketEntries, {
        state: {
          ...getBaseState(petitionerUser),
          caseDetail: {
            docketEntries: [
              {
                ...docketEntries[0],
                isLegacySealed: true,
                isMinuteEntry: false,
                isOnDocketRecord: true,
                isStricken: false,
                servedAt: '2020-01-23T21:44:54.034Z',
              },
            ],
          },
          screenMetadata: {
            isAssociated: true,
          },
        },
      });

      expect(result.formattedDocketEntriesOnDocketRecord[0]).toMatchObject({
        isLegacySealed: true,
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
          caseDetail,
          ...getBaseState(petitionsClerkUser),
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
});
