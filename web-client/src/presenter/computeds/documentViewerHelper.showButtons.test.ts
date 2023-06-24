import {
  CASE_STATUS_TYPES,
  INITIAL_DOCUMENT_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import {
  adcUser,
  docketClerkUser,
  petitionsClerkUser,
} from '../../../../shared/src/test/mockUsers';
import { applicationContext } from '../../applicationContext';
import { documentViewerHelper as documentViewerHelperComputed } from './documentViewerHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../src/withAppContext';

describe('documentViewerHelper', () => {
  const documentViewerHelper = withAppContextDecorator(
    documentViewerHelperComputed,
    applicationContext,
  );

  const DOCKET_ENTRY_ID = 'b8947b11-19b3-4c96-b7a1-fa6a5654e2d5';

  const baseDocketEntry = {
    createdAt: '2018-11-21T20:49:28.192Z',
    docketEntryId: DOCKET_ENTRY_ID,
    documentTitle: 'Petition',
    documentType: 'Petition',
    eventCode: INITIAL_DOCUMENT_TYPES.petition.documentType,
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

  describe('showCompleteQcButton', () => {
    const showCompleteQcButtonTests = [
      {
        description:
          'should be true if the user has EDIT_DOCKET_ENTRY permissions and the docket entry has an incomplete work item and is not in progress',
        docketEntryOverrides: {
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
        docketEntryOverrides: {
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
        docketEntryOverrides: {
          documentType: 'Proposed Stipulated Decision',
          eventCode: 'PSDE',
          servedAt: '2019-08-25T05:00:00.000Z',
        },
        expectation: undefined,
      },
      {
        description:
          'should be false if the user has EDIT_DOCKET_ENTRY permissions and the docket entry has an incomplete work item but is in progress',
        docketEntryOverrides: {
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
      ({ description, docketEntryOverrides, expectation, user }) => {
        it(`${description}`, () => {
          const { showCompleteQcButton } = runCompute(documentViewerHelper, {
            state: {
              ...getBaseState(user || docketClerkUser),
              caseDetail: {
                docketEntries: [
                  { ...baseDocketEntry, ...docketEntryOverrides },
                ],
                status: CASE_STATUS_TYPES.generalDocket,
              },
            },
          });

          expect(showCompleteQcButton).toEqual(expectation);
        });
      },
    );
  });

  describe('showServeCourtIssuedDocumentButton', () => {
    const showServeCourtIssuedDocumentButtonTests = [
      {
        description:
          'should be true if the document type is a servable court issued document that does not have a served at',
        docketEntryOverrides: {
          documentType: 'Order',
          eventCode: 'O',
        },
        expectation: true,
      },
      {
        description:
          'should be false if the document type is not a court issued document',
        docketEntryOverrides: {
          documentType: 'Miscellaneous',
        },
        expectation: false,
      },
      {
        description:
          'should be false if the document type is a servable court issued document and has servedAt',
        docketEntryOverrides: {
          documentType: 'Order',
          eventCode: 'O',
          servedAt: '2019-03-01T21:40:46.415Z',
        },
        expectation: false,
      },
      {
        description:
          'should be false if the document type is a servable court issued document without servedAt but the user does not have permission to serve the document',
        docketEntryOverrides: {
          documentType: 'Order',
          eventCode: 'O',
        },
        expectation: false,
        user: adcUser,
      },
    ];

    showServeCourtIssuedDocumentButtonTests.forEach(
      ({ description, docketEntryOverrides, expectation, user }) => {
        it(`${description}`, () => {
          const { showServeCourtIssuedDocumentButton } = runCompute(
            documentViewerHelper,
            {
              state: {
                ...getBaseState(user || docketClerkUser),
                caseDetail: {
                  docketEntries: [
                    {
                      ...baseDocketEntry, // the petition
                      docketEntryId: '77747b11-19b3-4c96-b7a1-fa6a5654e2d5',
                      servedAt: '2019-03-01T21:40:46.415Z',
                    },
                    { ...baseDocketEntry, ...docketEntryOverrides },
                  ],
                  status: CASE_STATUS_TYPES.generalDocket,
                },
              },
            },
          );

          expect(showServeCourtIssuedDocumentButton).toEqual(expectation);
        });
      },
    );
    it('does not show "Serve" button if service is NOT allowed on the case', () => {
      const { showServeCourtIssuedDocumentButton } = runCompute(
        documentViewerHelper,
        {
          state: {
            ...getBaseState(docketClerkUser),
            caseDetail: {
              docketEntries: [
                {
                  ...baseDocketEntry, // the petition
                  docketEntryId: '77747b11-19b3-4c96-b7a1-fa6a5654e2d5',
                  servedAt: undefined,
                },
                { ...baseDocketEntry, documentType: 'Order', eventCode: 'O' },
              ],
              status: CASE_STATUS_TYPES.new,
            },
          },
        },
      );

      expect(showServeCourtIssuedDocumentButton).toBe(false);
    });

    it('shows "Serve" button if service is allowed on the case', () => {
      const { showServeCourtIssuedDocumentButton } = runCompute(
        documentViewerHelper,
        {
          state: {
            ...getBaseState(docketClerkUser),
            caseDetail: {
              docketEntries: [
                {
                  ...baseDocketEntry, // the petition
                  docketEntryId: '77747b11-19b3-4c96-b7a1-fa6a5654e2d5',
                  servedAt: '2019-03-01T21:40:46.415Z',
                },
                { ...baseDocketEntry, documentType: 'Order', eventCode: 'O' },
              ],
              status: CASE_STATUS_TYPES.generalDocket,
            },
          },
        },
      );

      expect(showServeCourtIssuedDocumentButton).toBe(true);
    });
  });

  describe('showServePaperFiledDocumentButton', () => {
    const petitionDocketEntry = {
      ...baseDocketEntry,
      docketEntryId: 'petition-docket-entry-uuid',
      documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
      servedAt: '2019-03-01T21:40:46.415Z',
    };
    const showServePaperFiledDocumentButtonTests = [
      {
        description:
          'should be true if the document type is an external document (and not a Petition) that does not have a served at and permisisons.SERVE_DOCUMENT is true',
        docketEntryOverrides: {
          documentType: 'Answer',
          eventCode: 'A',
        },
        expectation: true,
      },
      {
        description:
          'should be false if the document type is not an external document',
        docketEntryOverrides: {
          documentType: 'Order',
          eventCode: 'O',
        },
        expectation: false,
      },
      {
        description:
          'should be false if the document type is an external document and has servedAt',
        docketEntryOverrides: {
          documentType: 'Answer',
          eventCode: 'A',
          servedAt: '2019-03-01T21:40:46.415Z',
        },
        expectation: false,
      },
      {
        description:
          'should be false if the document type is an external document without servedAt but the user does not have permission to serve the document',
        docketEntryOverrides: {
          documentType: 'Answer',
          eventCode: 'A',
        },
        expectation: false,
        user: adcUser,
      },
      {
        caseStatus: CASE_STATUS_TYPES.new,
        description:
          'should be false if the document type is an external document without servedAt but case is not in a state that allows service',
        docketEntryOverrides: {
          documentType: 'Answer',
          eventCode: 'A',
        },
        expectation: false,
        user: adcUser,
      },
    ];

    showServePaperFiledDocumentButtonTests.forEach(
      ({
        caseStatus,
        description,
        docketEntryOverrides,
        expectation,
        user,
      }) => {
        it(`${description}`, () => {
          const { showServePaperFiledDocumentButton } = runCompute(
            documentViewerHelper,
            {
              state: {
                ...getBaseState(user || docketClerkUser),
                caseDetail: {
                  docketEntries: [
                    petitionDocketEntry,
                    { ...baseDocketEntry, ...docketEntryOverrides },
                  ],
                  status: caseStatus || CASE_STATUS_TYPES.generalDocket,
                },
              },
            },
          );

          expect(showServePaperFiledDocumentButton).toEqual(expectation);
        });
      },
    );

    it('should be false if document service is not allowed on the case', () => {
      const { showServePaperFiledDocumentButton } = runCompute(
        documentViewerHelper,
        {
          state: {
            ...getBaseState(docketClerkUser),
            caseDetail: {
              docketEntries: [
                {
                  ...petitionDocketEntry,
                  servedAt: undefined,
                },
                {
                  ...baseDocketEntry,
                  documentType: 'Answer',
                  eventCode: 'A',
                },
              ],
              status: CASE_STATUS_TYPES.new,
            },
          },
        },
      );

      expect(showServePaperFiledDocumentButton).toEqual(false);
    });
  });

  describe('showServePetitionButton', () => {
    const showServePetitionButtonTests = [
      {
        description:
          'should be false if the document is a served Petition document and the user has SERVE_PETITION permission',
        docketEntryOverrides: {
          servedAt: '2019-03-01T21:40:46.415Z',
        },
        expectation: false,
      },
      {
        description:
          'should be false if the document is a not-served Petition document and the user does not have SERVE_PETITION permission',
        expectation: false,
        user: docketClerkUser,
      },
      {
        description:
          'should be true if the document is a not-served Petition document and the user has SERVE_PETITION permission',
        expectation: true,
      },
    ];

    showServePetitionButtonTests.forEach(
      ({ description, docketEntryOverrides, expectation, user }) => {
        it(`${description}`, () => {
          const { showServePetitionButton } = runCompute(documentViewerHelper, {
            state: {
              ...getBaseState(user || petitionsClerkUser),
              caseDetail: {
                docketEntries: [
                  { ...baseDocketEntry, ...docketEntryOverrides },
                ],
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
          'should be false if the eventCode is PSDE and the PSDE is not served',
        docketEntries: [
          {
            ...baseDocketEntry,
            documentType: 'Proposed Stipulated Decision',
            eventCode: 'PSDE',
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
});
