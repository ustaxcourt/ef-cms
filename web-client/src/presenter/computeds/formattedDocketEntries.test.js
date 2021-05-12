import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
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
  const { DOCUMENT_PROCESSING_STATUS_OPTIONS, USER_ROLES } =
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

  const petitionsClerkUser = {
    role: USER_ROLES.petitionsClerk,
    userId: '111',
  };
  const docketClerkUser = {
    role: USER_ROLES.docketClerk,
    userId: '222',
  };
  const petitionerUser = {
    role: USER_ROLES.petitioner,
    userId: '333',
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

  it('should format only lodged documents with overridden eventCode MISCL', () => {
    const result = runCompute(formattedDocketEntries, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: {
          ...MOCK_CASE,
          docketEntries: [
            {
              docketEntryId: '5d96bdfd-dc10-40db-b640-ef10c2591b6a',
              documentTitle: 'Motion for Leave to File Administrative Record',
              documentType: 'Motion for Leave to File Administrative Record',
              eventCode: 'M115',
              filingDate: '2020-07-08T16:33:41.180Z',
              isOnDocketRecord: true,
              lodged: true,
            },
            {
              docketEntryId: '6ca934be-aa01-476d-a437-9d50cc5c9e98',
              documentTitle: 'Motion for Leave to File Administrative Record',
              documentType: 'Motion for Leave to File Administrative Record',
              eventCode: 'M115',
              filingDate: '2020-07-08T16:33:41.180Z',
              isOnDocketRecord: true,
              lodged: false,
            },
          ],
        },
      },
    });

    const lodgedDocument = result.formattedDocketEntriesOnDocketRecord.find(
      d => d.docketEntryId === '5d96bdfd-dc10-40db-b640-ef10c2591b6a',
    );
    const unlodgedDocument = result.formattedDocketEntriesOnDocketRecord.find(
      d => d.docketEntryId === '6ca934be-aa01-476d-a437-9d50cc5c9e98',
    );

    expect(lodgedDocument.eventCode).toEqual('MISCL');
    expect(unlodgedDocument.eventCode).not.toEqual('MISCL');
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
      expect(result.formattedDocketEntriesOnDocketRecord[0]).toMatchObject({
        documentType: 'Petition',
      });
      expect(result.formattedDocketEntriesOnDocketRecord[1]).toMatchObject({
        documentTitle: 'Request for Place of Trial',
      });
      expect(result.formattedDocketEntriesOnDocketRecord[2]).toMatchObject({
        documentType: 'Other',
      });
      expect(result.formattedDocketEntriesOnDocketRecord[3]).toMatchObject({
        documentType: 'Ownership Disclosure Statement',
      });
    });

    it('sorts the docket record by descending date', () => {
      const result = runCompute(formattedDocketEntries, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: sortedCaseDetail,
          sessionMetadata: {
            docketRecordSort: { [sortedCaseDetail.docketNumber]: 'byDateDesc' },
          },
        },
      });
      expect(result.formattedDocketEntriesOnDocketRecord[3]).toMatchObject({
        documentTitle: 'Petition',
      });
      expect(result.formattedDocketEntriesOnDocketRecord[2]).toMatchObject({
        documentTitle: 'Request for Place of Trial',
      });
      expect(result.formattedDocketEntriesOnDocketRecord[1]).toMatchObject({
        documentTitle: 'Other',
      });
      expect(result.formattedDocketEntriesOnDocketRecord[0]).toMatchObject({
        documentTitle: 'Ownership Disclosure Statement',
      });
    });

    it('sorts the docket record by ascending index', () => {
      const result = runCompute(formattedDocketEntries, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: sortedCaseDetail,
          sessionMetadata: {
            docketRecordSort: { [sortedCaseDetail.docketNumber]: 'byIndex' },
          },
        },
      });
      expect(result.formattedDocketEntriesOnDocketRecord[0]).toMatchObject({
        documentTitle: 'Petition',
      });
      expect(result.formattedDocketEntriesOnDocketRecord[1]).toMatchObject({
        documentTitle: 'Request for Place of Trial',
      });
      expect(result.formattedDocketEntriesOnDocketRecord[3]).toMatchObject({
        documentTitle: 'Ownership Disclosure Statement',
      });
      expect(result.formattedDocketEntriesOnDocketRecord[2]).toMatchObject({
        documentTitle: 'Other',
      });
    });

    it('sorts the docket record by descending index', () => {
      const result = runCompute(formattedDocketEntries, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: sortedCaseDetail,
          sessionMetadata: {
            docketRecordSort: {
              [sortedCaseDetail.docketNumber]: 'byIndexDesc',
            },
          },
        },
      });
      expect(result.formattedDocketEntriesOnDocketRecord[0]).toMatchObject({
        documentTitle: 'Ownership Disclosure Statement',
      });
      expect(result.formattedDocketEntriesOnDocketRecord[1]).toMatchObject({
        documentTitle: 'Other',
      });
      expect(result.formattedDocketEntriesOnDocketRecord[2]).toMatchObject({
        documentTitle: 'Request for Place of Trial',
      });
      expect(result.formattedDocketEntriesOnDocketRecord[3]).toMatchObject({
        documentTitle: 'Petition',
      });
    });
  });

  describe('draft documents', () => {
    const docketEntries = [
      {
        createdAt: '2019-02-28T21:14:39.488Z',
        description: 'Petition',
        docketEntryId: 'Petition',
        documentType: 'Petition',
        eventCode: 'P',
        filedBy: 'Jessica Frase Marine',
        filingDate: '2019-02-28T21:14:39.488Z',
        index: 1,
        isOnDocketRecord: true,
        showValidationInput: '2019-02-28T21:14:39.488Z',
        status: 'served',
      },
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
      {
        archived: false,
        createdAt: '2019-02-28T21:14:39.488Z',
        docketEntryId: 'd-2-3-4',
        documentTitle: 'Stipulated Decision',
        documentType: 'Stipulated Decision',
        eventCode: 'SDEC',
        isDraft: true,
        isOnDocketRecord: false,
      },
    ];

    it('formats draft documents', () => {
      const result = runCompute(formattedDocketEntries, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...MOCK_CASE,
            docketEntries,
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
        {
          createdAtFormatted: '02/28/19',
          descriptionDisplay: 'Stipulated Decision',
          docketEntryId: 'd-2-3-4',
          documentType: 'Stipulated Decision',
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
            docketEntries: [docketEntries[0]],
          },
        },
      });

      expect(result.formattedDraftDocuments).toEqual([]);
    });
  });

  describe('stricken docket record', () => {
    const docketEntries = [
      {
        attachments: false,
        certificateOfService: false,
        createdAt: '2019-06-19T17:29:13.120Z',
        description: 'Motion to Dismiss for Lack of Jurisdiction',
        docketEntryId: '69094dbb-72bf-481e-a592-8d50dad7ffa8',
        documentTitle: 'Motion to Dismiss for Lack of Jurisdiction',
        documentType: 'Motion to Dismiss for Lack of Jurisdiction',
        eventCode: 'M073',
        filingDate: '2019-06-19T17:29:13.120Z',
        isFileAttached: true,
        isLegacy: true,
        isOnDocketRecord: true,
        isStricken: true,
        numberOfPages: 24,
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

      expect(result.formattedDocketEntriesOnDocketRecord[0].isStricken).toEqual(
        true,
      );
      expect(
        result.formattedDocketEntriesOnDocketRecord[0]
          .showDocumentDescriptionWithoutLink,
      ).toEqual(true);
      expect(
        result.formattedDocketEntriesOnDocketRecord[0].showLinkToDocument,
      ).toEqual(false);
      expect(
        result.formattedDocketEntriesOnDocketRecord[0].showDocumentViewerLink,
      ).toEqual(false);
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

      expect(
        result.formattedDocketEntriesOnDocketRecord[0].isLegacySealed,
      ).toBeTruthy();
      expect(
        result.formattedDocketEntriesOnDocketRecord[0]
          .showDocumentDescriptionWithoutLink,
      ).toEqual(true);
      expect(
        result.formattedDocketEntriesOnDocketRecord[0].showLinkToDocument,
      ).toEqual(false);
      expect(
        result.formattedDocketEntriesOnDocketRecord[0].showDocumentViewerLink,
      ).toEqual(false);
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

      expect(
        result.formattedDocketEntriesOnDocketRecord[0].isLegacyServed,
      ).toBeTruthy();
      expect(
        result.formattedDocketEntriesOnDocketRecord[0]
          .showDocumentDescriptionWithoutLink,
      ).toEqual(false);
      expect(
        result.formattedDocketEntriesOnDocketRecord[0].showLinkToDocument,
      ).toEqual(true);
      expect(
        result.formattedDocketEntriesOnDocketRecord[0].showDocumentViewerLink,
      ).toEqual(false);
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

      expect(
        result.formattedDocketEntriesOnDocketRecord[0]
          .showDocumentDescriptionWithoutLink,
      ).toEqual(true);
      expect(
        result.formattedDocketEntriesOnDocketRecord[0].showLinkToDocument,
      ).toEqual(false);
      expect(
        result.formattedDocketEntriesOnDocketRecord[0].showDocumentViewerLink,
      ).toEqual(false);
    });

    it('should show the link to an internal user for a document with a stricken docket record', () => {
      const result = runCompute(formattedDocketEntries, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: { ...MOCK_CASE, docketEntries },
        },
      });

      expect(result.formattedDocketEntriesOnDocketRecord[0].isStricken).toEqual(
        true,
      );
      expect(
        result.formattedDocketEntriesOnDocketRecord[0]
          .showDocumentDescriptionWithoutLink,
      ).toEqual(false);
      expect(
        result.formattedDocketEntriesOnDocketRecord[0].showLinkToDocument,
      ).toEqual(false);
      expect(
        result.formattedDocketEntriesOnDocketRecord[0].showDocumentViewerLink,
      ).toEqual(true);
    });
  });

  describe('formattedDocketEntriesOnDocketRecord and formattedPendingDocketEntriesOnDocketRecord', () => {
    it('should return formatted docket entries that are on the docket record, and in the pending list', () => {
      const caseDetail = {
        ...MOCK_CASE,
        docketEntries: [
          {
            ...mockDocketEntry,
            docketEntryId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
            documentTitle: 'Petition',
            documentType: 'Petition',
            eventCode: 'P',
            index: 1,
            isFileAttached: true,
            isMinuteEntry: false,
            isOnDocketRecord: true,
            pending: false,
          },
          {
            ...mockDocketEntry,
            docketEntryId: '087eb3f6-b164-40f3-980f-835da7292097',
            documentTitle: 'Request for Place of Trial at Seattle, Washington',
            documentType: 'Request for Place of Trial',
            eventCode: 'RQT',
            index: 2,
            isFileAttached: false,
            isMinuteEntry: true,
            isOnDocketRecord: true,
            isStricken: false,
            pending: false,
          },
          {
            ...mockDocketEntry,
            docketEntryId: '2efcd272-da92-4e31-bedc-28cdad2e08b0',
            documentTitle: 'Statement of Taxpayer Identification',
            documentType: 'Statement of Taxpayer Identification',
            eventCode: 'STIN',
            isFileAttached: true,
            isMinuteEntry: false,
            isOnDocketRecord: false,
            isStricken: false,
            pending: false,
          },
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
          {
            ...mockDocketEntry,
            docketEntryId: 'aa632296-fb1d-4aa7-8f06-6eeab813ac09',
            documentTitle: 'Answer',
            documentType: 'Answer',
            eventCode: 'A',
            index: 4,
            isFileAttached: true,
            isMinuteEntry: false,
            isOnDocketRecord: true,
            isStricken: false,
            pending: true,
          },
          {
            ...mockDocketEntry,
            docketEntryId: 'aa632296-fb1d-4aa7-8f06-6eeab813ac09',
            documentTitle: 'Hearing',
            documentType: 'Hearing before',
            eventCode: 'HEAR',
            index: 5,
            isFileAttached: true,
            isMinuteEntry: false,
            isOnDocketRecord: true,
            isStricken: false,
            pending: true,
          },
        ],
      };

      const result = runCompute(formattedDocketEntries, {
        state: {
          caseDetail,
          ...getBaseState(petitionsClerkUser),
        },
      });

      expect(result.formattedDocketEntriesOnDocketRecord).toMatchObject([
        {
          isOnDocketRecord: true,
        },
        {
          isOnDocketRecord: true,
        },
        {
          isOnDocketRecord: true,
        },
        {
          isOnDocketRecord: true,
        },
        {
          isOnDocketRecord: true,
        },
      ]);

      expect(result.formattedPendingDocketEntriesOnDocketRecord.length).toEqual(
        2,
      );
      expect(result.formattedPendingDocketEntriesOnDocketRecord).toMatchObject([
        {
          eventCode: 'PSDE',
          isOnDocketRecord: true,
          pending: true,
        },
        {
          eventCode: 'HEAR',
          isOnDocketRecord: true,
          pending: true,
        },
      ]);
    });

    it('should add items to formattedPendingDocketEntriesOnDocketRecord when isLegacyServed is true and the item is pending', async () => {
      const result = runCompute(formattedDocketEntries, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...MOCK_CASE,
            docketEntries: [
              {
                ...MOCK_CASE.docketEntries[2],
                docketEntryId: '999999',
                isLegacyServed: true,
                isOnDocketRecord: true,
                pending: true,
                servedAt: undefined,
                servedParties: undefined,
              },
            ],
          },
        },
      });

      expect(result.formattedPendingDocketEntriesOnDocketRecord).toMatchObject([
        { docketEntryId: '999999' },
      ]);
    });

    it('should add items to formattedPendingDocketEntriesOnDocketRecord when servedAt is defined and the item is pending', async () => {
      const result = runCompute(formattedDocketEntries, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...MOCK_CASE,
            docketEntries: [
              {
                ...MOCK_CASE.docketEntries[2],
                docketEntryId: '999999',
                isLegacyServed: false,
                isOnDocketRecord: true,
                pending: true,
                servedAt: '2019-08-25T05:00:00.000Z',
                servedParties: [
                  {
                    name: 'Bernard Lowe',
                  },
                  {
                    name: 'IRS',
                    role: 'irsSuperuser',
                  },
                ],
              },
            ],
          },
        },
      });

      expect(result.formattedPendingDocketEntriesOnDocketRecord).toMatchObject([
        { docketEntryId: '999999' },
      ]);
    });
  });

  describe('qcNeeded', () => {
    it('should set qcNeeded to true when work item is not read', () => {
      const result = runCompute(formattedDocketEntries, {
        state: {
          caseDetail: {
            ...MOCK_CASE,
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
          ...getBaseState(docketClerkUser),
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
            ...MOCK_CASE,
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
