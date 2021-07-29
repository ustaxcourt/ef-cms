import {
  adcUser,
  docketClerkUser,
  petitionsClerkUser,
} from '../../../../shared/src/test/mockUsers';
import { applicationContext } from '../../applicationContext';
import { documentViewerHelper as documentViewerHelperComputed } from './documentViewerHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../src/withAppContext';

const documentViewerHelper = withAppContextDecorator(
  documentViewerHelperComputed,
  applicationContext,
);

describe('documentViewerHelper', () => {
  const DOCKET_NUMBER = '101-20';
  const DOCKET_ENTRY_ID = 'b8947b11-19b3-4c96-b7a1-fa6a5654e2d5';

  const baseDocketEntry = {
    createdAt: '2018-11-21T20:49:28.192Z',
    docketEntryId: DOCKET_ENTRY_ID,
    documentTitle: 'Petition',
    documentType: 'Petition',
    eventCode: 'P',
    index: 1,
    isOnDocketRecord: true,
  };

  const getBaseState = user => {
    return {
      permissions: getUserPermissions(user),
      viewerDocumentToDisplay: {
        docketEntryId: DOCKET_ENTRY_ID,
      },
    };
  };

  beforeAll(() => {
    applicationContext.getCurrentUser = jest
      .fn()
      .mockReturnValue(docketClerkUser);
  });

  it('should return an empty object if the requested docketEntryId is not found in the docket record', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [baseDocketEntry],
        },
        viewerDocumentToDisplay: {
          docketEntryId: '0848a72a-e61b-4721-b4b8-b2a19ee98baa',
        },
      },
    });
    expect(result).toEqual({});
  });

  it('should return the document description', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [baseDocketEntry],
        },
      },
    });
    expect(result.description).toEqual('Petition');
  });

  it('should return a filed label with the filing date and party', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDocketEntry,
              filedBy: 'Test Petitioner',
              filingDate: '2018-11-21T20:49:28.192Z',
            },
          ],
        },
      },
    });
    expect(result.filedLabel).toEqual('Filed 11/21/18 by Test Petitioner');
  });

  it('should return an empty filed label for court-issued documents', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDocketEntry,
              documentType: 'Order',
            },
          ],
        },
      },
    });
    expect(result.filedLabel).toEqual('');
  });

  it('should return showSealedInBlackstone true or false based on whether the document has isLegacySealed', () => {
    let result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDocketEntry,
              isLegacySealed: false,
            },
          ],
        },
      },
    });
    expect(result.showSealedInBlackstone).toEqual(false);

    result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDocketEntry,
              isLegacySealed: true,
            },
          ],
        },
      },
    });
    expect(result.showSealedInBlackstone).toEqual(true);
  });

  it('should return a served label if the document has been served', () => {
    let result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [baseDocketEntry],
        },
      },
    });
    expect(result.servedLabel).toEqual('');

    result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDocketEntry,
              servedAt: '2018-11-21T20:49:28.192Z',
            },
          ],
        },
      },
    });
    expect(result.servedLabel).toEqual('Served 11/21/18');
  });

  describe('showNotServed', () => {
    const showNotServedTests = [
      {
        description:
          'should be true if the document type is servable and does not have a servedAt',
        docketEntry: {
          ...baseDocketEntry,
          documentType: 'Order',
          eventCode: 'O',
        },
        expectation: true,
      },
      {
        description: 'should be false if the document type is unservable',
        docketEntry: {
          ...baseDocketEntry,
          documentType: 'Corrected Transcript',
          eventCode: 'CTRA',
        },
        expectation: false,
      },
      {
        description:
          'should be false if the document type is servable and has servedAt',
        docketEntry: {
          ...baseDocketEntry,
          documentType: 'Order',
          eventCode: 'O',
          servedAt: '2019-03-01T21:40:46.415Z',
        },
        expectation: false,
      },
      {
        description:
          'should be false when the document is a legacy served document',
        docketEntry: {
          ...baseDocketEntry,
          documentType: 'Order',
          eventCode: 'O',
          isLegacyServed: true,
        },
        expectation: false,
      },
      {
        description:
          'should be true when the document is not a legacy served document and has no servedAt date',
        docketEntry: {
          ...baseDocketEntry,
          documentType: 'Order',
          eventCode: 'O',
          isLegacyServed: false,
        },
        expectation: true,
      },
    ];

    showNotServedTests.forEach(({ description, docketEntry, expectation }) => {
      it(`${description}`, () => {
        const { showNotServed } = runCompute(documentViewerHelper, {
          state: {
            ...getBaseState(docketClerkUser),
            caseDetail: {
              docketEntries: [docketEntry],
            },
          },
        });

        expect(showNotServed).toEqual(expectation);
      });
    });
  });

  describe('showServeCourtIssuedDocumentButton', () => {
    const showServeCourtIssuedDocumentButtonTests = [
      {
        description:
          'should be true if the document type is a servable court issued document that does not have a served at',
        docketEntry: {
          ...baseDocketEntry,
          documentType: 'Order',
          eventCode: 'O',
        },
        expectation: true,
      },
      {
        description:
          'should be false if the document type is not a court issued document',
        docketEntry: {
          ...baseDocketEntry,
          documentType: 'Miscellaneous',
        },
        expectation: false,
      },
      {
        description:
          'should be false if the document type is a servable court issued document and has servedAt',
        docketEntry: {
          ...baseDocketEntry,
          documentType: 'Order',
          eventCode: 'O',
          servedAt: '2019-03-01T21:40:46.415Z',
        },
        expectation: false,
      },
      {
        description:
          'should be false if the document type is a servable court issued document without servedAt but the user does not have permission to serve the document',
        docketEntry: {
          ...baseDocketEntry,
          documentType: 'Order',
          eventCode: 'O',
        },
        expectation: false,
        user: adcUser,
      },
      {
        description:
          'should be false when the document is a legacy served document',
        docketEntry: {
          ...baseDocketEntry,
          documentType: 'Order',
          eventCode: 'O',
          isLegacyServed: true,
        },
        expectation: false,
      },
      {
        description:
          'should be true when the document is not a legacy served document and has no servedAt date',
        docketEntry: {
          ...baseDocketEntry,
          documentType: 'Order',
          eventCode: 'O',
          isLegacyServed: false,
        },
        expectation: true,
      },
    ];

    showServeCourtIssuedDocumentButtonTests.forEach(
      ({ description, docketEntry, expectation, user }) => {
        it(`${description}`, () => {
          const { showServeCourtIssuedDocumentButton } = runCompute(
            documentViewerHelper,
            {
              state: {
                ...getBaseState(user || docketClerkUser),
                caseDetail: {
                  docketEntries: [docketEntry],
                },
              },
            },
          );

          expect(showServeCourtIssuedDocumentButton).toEqual(expectation);
        });
      },
    );
  });

  describe('showServePaperFiledDocumentButton', () => {
    const showServePaperFiledDocumentButtonTests = [
      {
        description:
          'should be true if the document type is an external document (and not a Petition) that does not have a served at and permisisons.SERVE_DOCUMENT is true',
        docketEntry: {
          ...baseDocketEntry,
          documentType: 'Answer',
          eventCode: 'A',
        },
        expectation: true,
      },
      {
        description:
          'should be false if the document type is not an external document',
        docketEntry: {
          ...baseDocketEntry,
          documentType: 'Order',
          eventCode: 'O',
        },
        expectation: false,
      },
      {
        description:
          'should be false if the document type is an external document and has servedAt',
        docketEntry: {
          ...baseDocketEntry,
          documentType: 'Answer',
          eventCode: 'A',
          servedAt: '2019-03-01T21:40:46.415Z',
        },
        expectation: false,
      },
      {
        description:
          'should be false if the document type is an external document without servedAt but the user does not have permission to serve the document',
        docketEntry: {
          ...baseDocketEntry,
          documentType: 'Answer',
          eventCode: 'A',
        },
        expectation: false,
        user: adcUser,
      },
      {
        description:
          'should be false when the document is a legacy served document',
        docketEntry: {
          ...baseDocketEntry,
          documentType: 'Entry of Appearance',
          eventCode: 'EA',
          isLegacyServed: true,
        },
        expectation: false,
      },
      {
        description:
          'should be true when the document is not a legacy served document and has no servedAt date',
        docketEntry: {
          ...baseDocketEntry,
          documentType: 'Entry of Appearance',
          eventCode: 'EA',
          isLegacyServed: false,
        },
        expectation: true,
      },
    ];

    showServePaperFiledDocumentButtonTests.forEach(
      ({ description, docketEntry, expectation, user }) => {
        it(`${description}`, () => {
          const { showServePaperFiledDocumentButton } = runCompute(
            documentViewerHelper,
            {
              state: {
                ...getBaseState(user || docketClerkUser),
                caseDetail: {
                  docketEntries: [docketEntry],
                },
              },
            },
          );

          expect(showServePaperFiledDocumentButton).toEqual(expectation);
        });
      },
    );
  });

  describe('showServePetitionButton', () => {
    const showServePetitionButtonTests = [
      {
        description:
          'should be false if the document is a served Petition document and the user has SERVE_PETITION permission',
        docketEntry: {
          ...baseDocketEntry,
          servedAt: '2019-03-01T21:40:46.415Z',
        },
        expectation: false,
      },
      {
        description:
          'should be false if the document is a not-served Petition document and the user does not have SERVE_PETITION permission',
        docketEntry: baseDocketEntry,
        expectation: false,
        user: docketClerkUser,
      },
      {
        description:
          'should be true if the document is a not-served Petition document and the user has SERVE_PETITION permission',
        docketEntry: baseDocketEntry,
        expectation: true,
      },
    ];

    showServePetitionButtonTests.forEach(
      ({ description, docketEntry, expectation, user }) => {
        it(`${description}`, () => {
          const { showServePetitionButton } = runCompute(documentViewerHelper, {
            state: {
              ...getBaseState(user || petitionsClerkUser),
              caseDetail: {
                docketEntries: [docketEntry],
              },
            },
          });

          expect(showServePetitionButton).toEqual(expectation);
        });
      },
    );
  });

  describe('showSignStipulatedDecisionButton', () => {
    const showSignStipulatedDecisionButtonTests = [
      {
        description:
          'should be true if the eventCode is PSDE, the PSDE is served, and the SDEC eventCode is not in the documents',
        docketEntries: [
          {
            ...baseDocketEntry,
            documentType: 'Proposed Stipulated Decision',
            eventCode: 'PSDE',
            servedAt: '2019-08-25T05:00:00.000Z',
          },
        ],
        expectation: true,
      },
      {
        description:
          'should be true if the eventCode is PSDE, the PSDE is legacy served, and the SDEC eventCode is not in the documents',
        docketEntries: [
          {
            ...baseDocketEntry,
            documentType: 'Proposed Stipulated Decision',
            eventCode: 'PSDE',
            isLegacyServed: true,
          },
        ],
        expectation: true,
      },
      {
        description:
          'should be false if the eventCode is PSDE and the PSDE is not served',
        docketEntries: [
          {
            ...baseDocketEntry,
            documentType: 'Proposed Stipulated Decision',
            eventCode: 'PSDE',
            isLegacyServed: false,
          },
        ],
        expectation: false,
      },
      {
        description:
          'should be true if the document code is PSDE, the PSDE is served, and an archived SDEC eventCode is in the documents',
        docketEntries: [
          {
            ...baseDocketEntry,
            documentType: 'Proposed Stipulated Decision',
            eventCode: 'PSDE',
            servedAt: '2019-08-25T05:00:00.000Z',
          },
          {
            archived: true,
            docketEntryId: '234',
            documentType: 'Stipulated Decision',
            eventCode: 'SDEC',
          },
        ],
        expectation: true,
      },
      {
        description:
          'should be false if the document code is PSDE, the PSDE is served, and the SDEC eventCode is in the documents (and is not archived)',
        docketEntries: [
          {
            ...baseDocketEntry,
            documentType: 'Proposed Stipulated Decision',
            eventCode: 'PSDE',
            servedAt: '2019-08-25T05:00:00.000Z',
          },
          {
            docketEntryId: '234',
            documentType: 'Stipulated Decision',
            eventCode: 'SDEC',
          },
        ],
        expectation: false,
      },
      {
        description: 'should be false if the eventCode is not PSDE',
        docketEntries: [
          {
            ...baseDocketEntry,
            documentType: 'Answer',
            eventCode: 'A',
          },
        ],
        expectation: false,
      },
    ];

    showSignStipulatedDecisionButtonTests.forEach(
      ({ description, docketEntries, expectation }) => {
        it(`${description}`, () => {
          const { showSignStipulatedDecisionButton } = runCompute(
            documentViewerHelper,
            {
              state: {
                ...getBaseState(docketClerkUser),
                caseDetail: { docketEntries },
              },
            },
          );

          expect(showSignStipulatedDecisionButton).toEqual(expectation);
        });
      },
    );
  });

  describe('showCompleteQcButton', () => {
    const showCompleteQcButtonTests = [
      {
        description:
          'should be true if the user has EDIT_DOCKET_ENTRY permissions and the docket entry has an incomplete work item and is not in progress',
        docketEntry: {
          ...baseDocketEntry,
          documentType: 'Proposed Stipulated Decision',
          eventCode: 'PSDE',
          servedAt: '2019-08-25T05:00:00.000Z',
          workItem: {},
        },
        expectation: true,
      },
      {
        description:
          'should be false if the user does not have EDIT_DOCKET_ENTRY permissions and the docket entry has an incomplete work item and is not in progress',
        docketEntry: {
          ...baseDocketEntry,
          documentType: 'Proposed Stipulated Decision',
          eventCode: 'PSDE',
          servedAt: '2019-08-25T05:00:00.000Z',
          workItem: {},
        },
        expectation: false,
        user: adcUser,
      },
      {
        description:
          'should be undefined if the user has EDIT_DOCKET_ENTRY permissions and the docket entry does not have an incomplete work item',
        docketEntry: {
          ...baseDocketEntry,
          documentType: 'Proposed Stipulated Decision',
          eventCode: 'PSDE',
          servedAt: '2019-08-25T05:00:00.000Z',
        },
        expectation: undefined,
      },
      {
        description:
          'should be false if the user has EDIT_DOCKET_ENTRY permissions and the docket entry has an incomplete work item but is in progress',
        docketEntry: {
          ...baseDocketEntry,
          documentType: 'Proposed Stipulated Decision',
          eventCode: 'PSDE',
          isFileAttached: false,
          servedAt: '2019-08-25T05:00:00.000Z',
          workItem: {},
        },
        expectation: false,
      },
    ];

    showCompleteQcButtonTests.forEach(
      ({ description, docketEntry, expectation, user }) => {
        it(`${description}`, () => {
          const { showCompleteQcButton } = runCompute(documentViewerHelper, {
            state: {
              ...getBaseState(user || docketClerkUser),
              caseDetail: { docketEntries: [docketEntry] },
            },
          });

          expect(showCompleteQcButton).toEqual(expectation);
        });
      },
    );
  });

  it('should show stricken information if the associated document has been stricken', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDocketEntry,
              isStricken: true,
            },
          ],
        },
      },
    });

    expect(result.showStricken).toEqual(true);
  });

  it('should show stricken information if the docket entry has been stricken', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDocketEntry,
              isStricken: true,
            },
          ],
        },
      },
    });

    expect(result.showStricken).toEqual(true);
  });

  it('should return documentViewerLink with docketNumber and viewerDocumentToDisplay.docketEntryId', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [baseDocketEntry],
          docketNumber: DOCKET_NUMBER,
        },
      },
    });

    expect(result.documentViewerLink).toEqual(
      `/case-detail/${DOCKET_NUMBER}/document-view?docketEntryId=${DOCKET_ENTRY_ID}`,
    );
  });

  it('should return completeQcLink with docketNumber and viewerDocumentToDisplay.docketEntryId', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [baseDocketEntry],
          docketNumber: DOCKET_NUMBER,
        },
      },
    });

    expect(result.completeQcLink).toEqual(
      `/case-detail/${DOCKET_NUMBER}/documents/${DOCKET_ENTRY_ID}/edit`,
    );
  });

  it('should return reviewAndServePetitionLink with docketNumber and viewerDocumentToDisplay.docketEntryId', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [baseDocketEntry],
          docketNumber: DOCKET_NUMBER,
        },
      },
    });

    expect(result.reviewAndServePetitionLink).toEqual(
      `/case-detail/${DOCKET_NUMBER}/petition-qc/document-view/${DOCKET_ENTRY_ID}`,
    );
  });

  it('should return signStipulatedDecisionLink with docketNumber and viewerDocumentToDisplay.docketEntryId', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [baseDocketEntry],
          docketNumber: DOCKET_NUMBER,
        },
      },
    });

    expect(result.signStipulatedDecisionLink).toEqual(
      `/case-detail/${DOCKET_NUMBER}/edit-order/${DOCKET_ENTRY_ID}/sign`,
    );
  });
});
