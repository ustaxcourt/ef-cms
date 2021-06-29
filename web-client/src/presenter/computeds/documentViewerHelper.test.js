import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
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

  const docketClerkUser = {
    role: ROLES.docketClerk,
  };
  const petitionsClerkUser = {
    role: ROLES.petitionsClerk,
  };
  const adcUser = {
    role: ROLES.adc,
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
    applicationContext.getCurrentUser = jest.fn().mockReturnValue({
      role: 'docketclerk',
      userId: '123',
    });
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
    it('should be true if the document type is servable and does not have a servedAt', () => {
      const result = runCompute(documentViewerHelper, {
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

      expect(result.showNotServed).toEqual(true);
    });

    it('should be false if the document type is unservable', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Corrected Transcript',
                eventCode: 'CTRA',
              },
            ],
          },
        },
      });

      expect(result.showNotServed).toEqual(false);
    });

    it('should be false if the document type is servable and has servedAt', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Order',
                eventCode: 'O',
                servedAt: '2019-03-01T21:40:46.415Z',
              },
            ],
          },
        },
      });

      expect(result.showNotServed).toEqual(false);
    });

    it('should be false when the document is a legacy served document', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Order',
                eventCode: 'O',
                isLegacyServed: true,
              },
            ],
          },
        },
      });

      expect(result.showNotServed).toEqual(false);
    });

    it('should be true when the document is not a legacy served document and has no servedAt date', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Order',
                eventCode: 'O',
                isLegacyServed: false,
              },
            ],
          },
        },
      });

      expect(result.showNotServed).toEqual(true);
    });
  });

  describe('showServeCourtIssuedDocumentButton', () => {
    it('should be true if the document type is a servable court issued document that does not have a served at', () => {
      const result = runCompute(documentViewerHelper, {
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

      expect(result.showServeCourtIssuedDocumentButton).toEqual(true);
    });

    it('should be false if the document type is not a court issued document', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Miscellaneous',
              },
            ],
          },
        },
      });

      expect(result.showServeCourtIssuedDocumentButton).toEqual(false);
    });

    it('should be false if the document type is a servable court issued document and has servedAt', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Order',
                eventCode: 'O',
                servedAt: '2019-03-01T21:40:46.415Z',
              },
            ],
          },
        },
      });

      expect(result.showServeCourtIssuedDocumentButton).toEqual(false);
    });

    it('should be false if the document type is a servable court issued document without servedAt but the user does not have permission to serve the document', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Order',
                eventCode: 'O',
                servedAt: '2019-03-01T21:40:46.415Z',
              },
            ],
          },
        },
      });

      expect(result.showServeCourtIssuedDocumentButton).toEqual(false);
    });

    it('should be false when the document is a legacy served document', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Order',
                eventCode: 'O',
                isLegacyServed: true,
              },
            ],
          },
        },
      });

      expect(result.showServeCourtIssuedDocumentButton).toEqual(false);
    });

    it('should be true when the document is not a legacy served document and has no servedAt date', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Order',
                eventCode: 'O',
                isLegacyServed: false,
              },
            ],
          },
        },
      });

      expect(result.showServeCourtIssuedDocumentButton).toEqual(true);
    });
  });

  describe('showServePaperFiledDocumentButton', () => {
    it('should be true if the document type is an external document (and not a Petition) that does not have a served at and permisisons.SERVE_DOCUMENT is true', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Answer',
                eventCode: 'A',
              },
            ],
          },
        },
      });

      expect(result.showServePaperFiledDocumentButton).toEqual(true);
    });

    it('should be false if the document type is not an external document', () => {
      const result = runCompute(documentViewerHelper, {
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

      expect(result.showServePaperFiledDocumentButton).toEqual(false);
    });

    it('should be false if the document type is an external document and has servedAt', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Answer',
                eventCode: 'A',
                servedAt: '2019-03-01T21:40:46.415Z',
              },
            ],
          },
        },
      });

      expect(result.showServePaperFiledDocumentButton).toEqual(false);
    });

    it('should be false if the document type is an external document without servedAt but the user does not have permission to serve the document', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(adcUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Answer',
                eventCode: 'A',
              },
            ],
          },
        },
      });

      expect(result.showServePaperFiledDocumentButton).toEqual(false);
    });

    it('should be false when the document is a legacy served document', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Entry of Appearance',
                eventCode: 'EA',
                isLegacyServed: true,
              },
            ],
          },
        },
      });

      expect(result.showServePaperFiledDocumentButton).toEqual(false);
    });

    it('should be true when the document is not a legacy served document and has no servedAt date', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Entry of Appearance',
                eventCode: 'EA',
                isLegacyServed: false,
              },
            ],
          },
        },
      });

      expect(result.showServePaperFiledDocumentButton).toEqual(true);
    });
  });

  describe('showServePetitionButton', () => {
    it('should be false if the document is a served Petition document and the user has SERVE_PETITION permission', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                servedAt: '2019-03-01T21:40:46.415Z',
              },
            ],
          },
        },
      });

      expect(result.showServePetitionButton).toEqual(false);
    });

    it('should be false if the document is a not-served Petition document and the user does not have SERVE_PETITION permission', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [baseDocketEntry],
          },
        },
      });

      expect(result.showServePetitionButton).toEqual(false);
    });

    it('should be true if the document is a not-served Petition document and the user has SERVE_PETITION permission', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            docketEntries: [baseDocketEntry],
          },
        },
      });

      expect(result.showServePetitionButton).toEqual(true);
    });
  });

  describe('showSignStipulatedDecisionButton', () => {
    it('should be true if the eventCode is PSDE, the PSDE is served, and the SDEC eventCode is not in the documents', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Proposed Stipulated Decision',
                eventCode: 'PSDE',
                servedAt: '2019-08-25T05:00:00.000Z',
              },
            ],
          },
        },
      });

      expect(result.showSignStipulatedDecisionButton).toEqual(true);
    });

    it('should be true if the eventCode is PSDE, the PSDE is legacy served, and the SDEC eventCode is not in the documents', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Proposed Stipulated Decision',
                eventCode: 'PSDE',
                isLegacyServed: true,
              },
            ],
          },
        },
      });

      expect(result.showSignStipulatedDecisionButton).toEqual(true);
    });

    it('should be undefined if the eventCode is PSDE and the PSDE is not served', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Proposed Stipulated Decision',
                eventCode: 'PSDE',
                isLegacyServed: false,
              },
            ],
          },
        },
      });

      expect(result.showSignStipulatedDecisionButton).toBeFalsy();
    });

    it('should be true if the document code is PSDE, the PSDE is served, and an archived SDEC eventCode is in the documents', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
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
          },
        },
      });

      expect(result.showSignStipulatedDecisionButton).toEqual(true);
    });

    it('should be false if the document code is PSDE, the PSDE is served, and the SDEC eventCode is in the documents (and is not archived)', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
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
          },
        },
      });

      expect(result.showSignStipulatedDecisionButton).toEqual(false);
    });

    it('should be false if the eventCode is not PSDE', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Answer',
                eventCode: 'A',
              },
            ],
          },
        },
      });

      expect(result.showSignStipulatedDecisionButton).toEqual(false);
    });
  });

  describe('showCompleteQcButton', () => {
    it('should be true if the user has EDIT_DOCKET_ENTRY permissions and the docket entry has an incomplete work item and is not in progress', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Proposed Stipulated Decision',
                eventCode: 'PSDE',
                servedAt: '2019-08-25T05:00:00.000Z',
                workItem: {},
              },
            ],
          },
        },
      });

      expect(result.showCompleteQcButton).toBeTruthy();
    });

    it('should be false if the user does not have EDIT_DOCKET_ENTRY permissions and the docket entry has an incomplete work item and is not in progress', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(adcUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Proposed Stipulated Decision',
                eventCode: 'PSDE',
                servedAt: '2019-08-25T05:00:00.000Z',
                workItem: {},
              },
            ],
          },
        },
      });

      expect(result.showCompleteQcButton).toBeFalsy();
    });

    it('should be false if the user has EDIT_DOCKET_ENTRY permissions and the docket entry does not have an incomplete work item', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Proposed Stipulated Decision',
                eventCode: 'PSDE',
                servedAt: '2019-08-25T05:00:00.000Z',
              },
            ],
          },
        },
      });

      expect(result.showCompleteQcButton).toBeFalsy();
    });

    it('should be false if the user has EDIT_DOCKET_ENTRY permissions and the docket entry has an incomplete work item but is in progress', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Proposed Stipulated Decision',
                eventCode: 'PSDE',
                isFileAttached: false,
                servedAt: '2019-08-25T05:00:00.000Z',
                workItem: {},
              },
            ],
          },
        },
      });

      expect(result.showCompleteQcButton).toBeFalsy();
    });
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
