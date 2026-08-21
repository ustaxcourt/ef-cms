import {
  CASE_STATUS_TYPES,
  INITIAL_DOCUMENT_TYPES,
  UNSERVABLE_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@web-client/applicationContext';
import {
  adcUser,
  clerkOfCourtUser,
  colvinsChambersUser,
  docketClerkUser,
  judgeUser,
} from '@shared/test/mockUsers';
import { documentViewerHelper as documentViewerHelperComputed } from './documentViewerHelper';
import { getUserPermissions } from '@web-client/authorization/getUserPermissions';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '@web-client/withAppContext';

const documentViewerHelper = withAppContextDecorator(
  documentViewerHelperComputed,
  applicationContext,
);

describe('documentViewerHelper', () => {
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
      user,
      viewerDocumentToDisplay: {
        docketEntryId: DOCKET_ENTRY_ID,
      },
    };
  };

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

  it('should return the document description and filed label', () => {
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
    expect(result.description).toEqual('Petition');
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

  it('should return showNotServed true if the document type is servable and does not have a servedAt', () => {
    const { showNotServed } = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDocketEntry,
              documentType: 'Order',
              eventCode: 'O',
            },
          ],
        },
      },
    });

    expect(showNotServed).toEqual(true);
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

  describe('showUnservedPetitionWarning', () => {
    it('should be false if a servable document is selected and the case is eligible for service', () => {
      const { showUnservedPetitionWarning } = runCompute(documentViewerHelper, {
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
            status: CASE_STATUS_TYPES.calendared,
          },
        },
      });

      expect(showUnservedPetitionWarning).toBe(false);
    });

    it('should be true if an otherwise servable document is selected but the case is new', () => {
      const { showUnservedPetitionWarning } = runCompute(documentViewerHelper, {
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
      });

      expect(showUnservedPetitionWarning).toBe(true);
    });

    it('should be false if the selected document is the petition', () => {
      const { showUnservedPetitionWarning } = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [baseDocketEntry],
          },
        },
      });

      expect(showUnservedPetitionWarning).toBe(false);
    });

    it('should be false if an servable document is selected and the petition on the case is served', () => {
      const { showUnservedPetitionWarning } = runCompute(documentViewerHelper, {
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
          },
        },
      });

      expect(showUnservedPetitionWarning).toBe(false);
    });
  });

  describe('showMotionOrderResponseButton', () => {
    it('should show order response button when judge user has permission and document is in allowlist', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(judgeUser),
          caseDetail: {
            docketEntries: [{ ...baseDocketEntry, eventCode: 'M000' }],
            leadDocketNumber: '123-45',
            petitioners: [
              {
                name: 'Test Petitioner',
                serviceIndicator: 'Electronic',
              },
            ],
          },
          viewerDocumentToDisplay: {
            ...baseDocketEntry,
            eventCode: 'M000',
          },
        },
      });

      expect(result.showOrderResponseButton).toBe(true);
    });

    it('should show order response button when adc user has permission and document is in allowlist', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(adcUser),
          caseDetail: {
            docketEntries: [{ ...baseDocketEntry, eventCode: 'M000' }],
            leadDocketNumber: '123-45',
            petitioners: [
              {
                name: 'Test Petitioner',
                serviceIndicator: 'Electronic',
              },
            ],
          },
          viewerDocumentToDisplay: {
            ...baseDocketEntry,
            eventCode: 'M000',
          },
        },
      });

      expect(result.showOrderResponseButton).toBe(true);
    });

    it('should show order response button when chambers user has permission and document is in allowlist', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(colvinsChambersUser),
          caseDetail: {
            docketEntries: [{ ...baseDocketEntry, eventCode: 'M000' }],
            leadDocketNumber: '123-45',
            petitioners: [
              {
                name: 'Test Petitioner',
                serviceIndicator: 'Electronic',
              },
            ],
          },
          viewerDocumentToDisplay: {
            ...baseDocketEntry,
            eventCode: 'M000',
          },
        },
      });

      expect(result.showOrderResponseButton).toBe(true);
    });

    it('should not show order response button when user lacks permission', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(clerkOfCourtUser),
          caseDetail: {
            docketEntries: [{ ...baseDocketEntry, eventCode: 'M000' }],
            leadDocketNumber: '123-45',
            petitioners: [
              {
                name: 'Test Petitioner',
                serviceIndicator: 'Electronic',
              },
            ],
          },
          viewerDocumentToDisplay: {
            ...baseDocketEntry,
            eventCode: 'M000',
          },
        },
      });

      expect(result.showOrderResponseButton).toBe(false);
    });

    it('should not show order response button when document is not in allowlist', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(judgeUser),
          caseDetail: {
            docketEntries: [{ ...baseDocketEntry, eventCode: 'NOT_ALLOWED' }],
            leadDocketNumber: '123-45',
            petitioners: [
              {
                name: 'Test Petitioner',
                serviceIndicator: 'Electronic',
              },
            ],
          },
          viewerDocumentToDisplay: {
            ...baseDocketEntry,
            eventCode: 'NOT_ALLOWED',
          },
        },
      });

      expect(result.showOrderResponseButton).toBe(false);
    });
  });

  describe('showLeadCaseBanner', () => {
    it('should be true when viewing an unserved multi-docketed document on a member case', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentTitle: 'Simultaneous Answering Memorandum Brief',
                eventCode: 'SAMB',
                multiDocketedOn: ['101-20', '102-20'],
                servedAt: undefined,
              },
            ],
            docketNumber: '102-20',
            leadDocketNumber: '101-20',
            status: CASE_STATUS_TYPES.generalDocket,
          },
          viewerDocumentToDisplay: {
            docketEntryId: DOCKET_ENTRY_ID,
            documentTitle: 'Simultaneous Answering Memorandum Brief',
            eventCode: 'SAMB',
          },
        },
      });

      expect(result.showLeadCaseBanner).toBe(true);
    });

    it('should be false when viewing a served multi-docketed document on a member case', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentTitle: 'Simultaneous Answering Memorandum Brief',
                multiDocketedOn: ['101-20', '102-20'],
                eventCode: 'SAMB',
                servedAt: '2019-03-01T21:40:46.415Z',
              },
            ],
            docketNumber: '102-20',
            leadDocketNumber: '101-20',
            status: CASE_STATUS_TYPES.generalDocket,
          },
          viewerDocumentToDisplay: {
            docketEntryId: DOCKET_ENTRY_ID,
            documentTitle: 'Simultaneous Answering Memorandum Brief',
            eventCode: 'SAMB',
          },
        },
      });

      expect(result.showLeadCaseBanner).toBe(false);
    });

    it('should be false when viewing an unserved multi-docketed document on the lead case', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentTitle: 'Simultaneous Answering Memorandum Brief',
                eventCode: 'SAMB',
                multiDocketedOn: ['101-20', '102-20'],
                servedAt: undefined,
              },
            ],
            docketNumber: '101-20',
            leadDocketNumber: '101-20',
            status: CASE_STATUS_TYPES.generalDocket,
          },
          viewerDocumentToDisplay: {
            docketEntryId: DOCKET_ENTRY_ID,
            documentTitle: 'Simultaneous Answering Memorandum Brief',
            eventCode: 'SAMB',
          },
        },
      });

      expect(result.showLeadCaseBanner).toBe(false);
    });

    it('should be false when it was not multi-docketed', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentTitle: 'Simultaneous Answering Memorandum Brief',
                multiDocketedOn: [],
                eventCode: 'SAMB',
                servedAt: undefined,
              },
            ],
            docketNumber: '102-20',
            leadDocketNumber: '101-20',
            status: CASE_STATUS_TYPES.generalDocket,
          },
          viewerDocumentToDisplay: {
            docketEntryId: DOCKET_ENTRY_ID,
            documentTitle: 'Simultaneous Answering Memorandum Brief',
            eventCode: 'SAMB',
          },
        },
      });

      expect(result.showLeadCaseBanner).toBe(false);
    });

    it('should be false when viewing an unservable multi-docketed document on a member case', () => {
      const unservableEventCode = UNSERVABLE_EVENT_CODES[0];
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentTitle: 'Unservable Document',
                eventCode: unservableEventCode,
                multiDocketedOn: ['101-20', '102-20'],
                servedAt: undefined,
              },
            ],
            docketNumber: '102-20',
            leadDocketNumber: '101-20',
            status: CASE_STATUS_TYPES.generalDocket,
          },
          viewerDocumentToDisplay: {
            docketEntryId: DOCKET_ENTRY_ID,
            documentTitle: 'Unservable Document',
            eventCode: unservableEventCode,
          },
        },
      });

      expect(result.showLeadCaseBanner).toBe(false);
    });

    it('should be false when user does not have SERVE_DOCUMENT permission', () => {
      const petitionerUser = {
        email: 'petitioner@example.com',
        name: 'Test Petitioner',
        role: 'petitioner',
        userId: '9ea5b102-d142-4106-b1e2-e80fe7d754ce',
      };

      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(petitionerUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentTitle: 'Simultaneous Answering Memorandum Brief',
                multiDocketedOn: ['101-20', '102-20'],
                eventCode: 'SAMB',
                servedAt: undefined,
              },
            ],
            docketNumber: '102-20',
            leadDocketNumber: '101-20',
            status: CASE_STATUS_TYPES.generalDocket,
          },
          viewerDocumentToDisplay: {
            docketEntryId: DOCKET_ENTRY_ID,
            documentTitle: 'Simultaneous Answering Memorandum Brief',
            eventCode: 'SAMB',
          },
        },
      });

      expect(result.showLeadCaseBanner).toBe(false);
    });
  });

  describe('showServeCourtIssuedDocumentButton', () => {
    it('should be true when the case is not in a consolidated group', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              { ...baseDocketEntry, documentType: 'Order', eventCode: 'O' },
            ],
            docketNumber: '101-20',
            status: CASE_STATUS_TYPES.generalDocket,
          },
        },
      });

      expect(result.showServeCourtIssuedDocumentButton).toBe(true);
    });

    it('should be true when the case is the lead case', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              { ...baseDocketEntry, documentType: 'Order', eventCode: 'O' },
            ],
            docketNumber: '101-20',
            leadDocketNumber: '101-20',
            status: CASE_STATUS_TYPES.generalDocket,
          },
        },
      });

      expect(result.showServeCourtIssuedDocumentButton).toBe(true);
    });

    it('should be true when the case is a member case and the document is not multi-docketed', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Order',
                eventCode: 'O',
                multiDocketedOn: [],
              },
            ],
            docketNumber: '102-20',
            leadDocketNumber: '101-20',
            status: CASE_STATUS_TYPES.generalDocket,
          },
        },
      });

      expect(result.showServeCourtIssuedDocumentButton).toBe(true);
    });

    it('should be false when the case is a member case and the document is multi-docketed', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Order',
                eventCode: 'O',
                multiDocketedOn: ['101-20', '102-20'],
              },
            ],
            docketNumber: '102-20',
            leadDocketNumber: '101-20',
            status: CASE_STATUS_TYPES.generalDocket,
          },
        },
      });

      expect(result.showServeCourtIssuedDocumentButton).toBe(false);
    });
  });

  describe('showServePaperFiledDocumentButton', () => {
    it('should be true when the case is not in a consolidated group', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                eventCode: 'SAMB',
                documentType: 'Simultaneous Answering Memorandum Brief',
              },
            ],
            docketNumber: '101-20',
            status: CASE_STATUS_TYPES.generalDocket,
          },
        },
      });

      expect(result.showServePaperFiledDocumentButton).toBe(true);
    });

    it('should be true when the case is the lead case', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                eventCode: 'SAMB',
                documentType: 'Simultaneous Answering Memorandum Brief',
              },
            ],
            docketNumber: '101-20',
            leadDocketNumber: '101-20',
            status: CASE_STATUS_TYPES.generalDocket,
          },
        },
      });

      expect(result.showServePaperFiledDocumentButton).toBe(true);
    });

    it('should be true when the case is a member case and the document is not multi-docketed', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                eventCode: 'SAMB',
                documentType: 'Simultaneous Answering Memorandum Brief',
                multiDocketedOn: [],
              },
            ],
            docketNumber: '102-20',
            leadDocketNumber: '101-20',
            status: CASE_STATUS_TYPES.generalDocket,
          },
        },
      });

      expect(result.showServePaperFiledDocumentButton).toBe(true);
    });

    it('should be false when the case is a member case and the document is multi-docketed', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                eventCode: 'SAMB',
                documentType: 'Simultaneous Answering Memorandum Brief',
                multiDocketedOn: ['101-20', '102-20'],
              },
            ],
            docketNumber: '102-20',
            leadDocketNumber: '101-20',
            status: CASE_STATUS_TYPES.generalDocket,
          },
        },
      });

      expect(result.showServePaperFiledDocumentButton).toBe(false);
    });
  });
});
