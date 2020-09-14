import { applicationContext } from '../../applicationContext';
import { documentViewerHelper as documentViewerHelperComputed } from './documentViewerHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../src/withAppContext';

const documentViewerHelper = withAppContextDecorator(
  documentViewerHelperComputed,
  applicationContext,
);
describe('documentViewerHelper', () => {
  beforeAll(() => {
    applicationContext.getCurrentUser = jest.fn().mockReturnValue({
      role: 'docketclerk',
      userId: '123',
    });
  });

  it('should return an empty object if the requested docketEntryId is not found in the docket record', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentTitle: 'Petition',
              documentType: 'Petition',
              index: 1,
              isOnDocketRecord: true,
            },
          ],
        },
        permissions: {
          SERVE_DOCUMENT: false,
        },
        viewerDocumentToDisplay: {
          docketEntryId: '999',
        },
      },
    });
    expect(result).toEqual({});
  });

  it('should return the document description', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentTitle: 'Petition',
              documentType: 'Petition',
              index: 1,
              isOnDocketRecord: true,
            },
          ],
        },
        permissions: {
          SERVE_DOCUMENT: false,
        },
        viewerDocumentToDisplay: {
          docketEntryId: 'abc',
        },
      },
    });
    expect(result.description).toEqual('Petition');
  });

  it('should return a filed label with the filing date and party', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        caseDetail: {
          docketEntries: [
            {
              createdAt: '2018-11-21T20:49:28.192Z',
              docketEntryId: 'abc',
              documentTitle: 'Petition',
              documentType: 'Petition',
              filedBy: 'Test Petitioner',
              filingDate: '2018-11-21T20:49:28.192Z',
              index: 1,
              isOnDocketRecord: true,
            },
          ],
        },
        permissions: {
          SERVE_DOCUMENT: false,
        },
        viewerDocumentToDisplay: {
          docketEntryId: 'abc',
        },
      },
    });
    expect(result.filedLabel).toEqual('Filed 11/21/18 by Test Petitioner');
  });

  it('should return an empty filed label for court-issued documents', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        caseDetail: {
          docketEntries: [
            {
              createdAt: '2018-11-22T20:49:28.192Z',
              docketEntryId: 'abc',
              documentTitle: 'Petition',
              documentType: 'Order',
              index: 1,
              isOnDocketRecord: true,
            },
          ],
        },
        permissions: {
          SERVE_DOCUMENT: false,
        },
        viewerDocumentToDisplay: {
          docketEntryId: 'abc',
        },
      },
    });
    expect(result.filedLabel).toEqual('');
  });

  it('should return showSealedInBlackstone true or false based on whether the document has isLegacySealed', () => {
    let result = runCompute(documentViewerHelper, {
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentTitle: 'Petition',
              documentType: 'Petition',
              index: 1,
              isLegacySealed: false,
              isOnDocketRecord: true,
            },
          ],
        },
        permissions: {
          SERVE_DOCUMENT: false,
        },
        viewerDocumentToDisplay: {
          docketEntryId: 'abc',
        },
      },
    });
    expect(result.showSealedInBlackstone).toEqual(false);

    result = runCompute(documentViewerHelper, {
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentType: 'Petition',
              isLegacySealed: true,
              isOnDocketRecord: true,
            },
          ],
        },
        permissions: {
          SERVE_DOCUMENT: false,
        },
        viewerDocumentToDisplay: {
          docketEntryId: 'abc',
        },
      },
    });
    expect(result.showSealedInBlackstone).toEqual(true);
  });

  it('should return a served label if the document has been served', () => {
    let result = runCompute(documentViewerHelper, {
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentTitle: 'Petition',
              documentType: 'Petition',
              index: 1,
              isOnDocketRecord: true,
            },
          ],
        },
        permissions: {
          SERVE_DOCUMENT: false,
        },
        viewerDocumentToDisplay: {
          docketEntryId: 'abc',
        },
      },
    });
    expect(result.servedLabel).toEqual('');

    result = runCompute(documentViewerHelper, {
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentType: 'Petition',
              isOnDocketRecord: true,
              servedAt: '2018-11-21T20:49:28.192Z',
            },
          ],
        },
        permissions: {
          SERVE_DOCUMENT: false,
        },
        viewerDocumentToDisplay: {
          docketEntryId: 'abc',
        },
      },
    });
    expect(result.servedLabel).toEqual('Served 11/21/18');
  });

  describe('showNotServed', () => {
    const docketEntryId = applicationContext.getUniqueId();

    it('should be true if the document type is servable and does not have a servedAt', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            docketEntries: [
              {
                docketEntryId,
                documentTitle: 'Some Stuff',
                documentType: 'Order',
                eventCode: 'O',
                isOnDocketRecord: true,
              },
            ],
          },
          permissions: {
            SERVE_DOCUMENT: false,
          },
          viewerDocumentToDisplay: {
            docketEntryId,
          },
        },
      });

      expect(result.showNotServed).toEqual(true);
    });

    it('should be false if the document type is unservable', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            docketEntries: [
              {
                docketEntryId,
                documentTitle: 'Some Stuff',
                documentType: 'Corrected Transcript',
                eventCode: 'CTRA',
                isOnDocketRecord: true,
              },
            ],
          },
          permissions: {
            SERVE_DOCUMENT: false,
          },
          viewerDocumentToDisplay: {
            docketEntryId,
          },
        },
      });

      expect(result.showNotServed).toEqual(false);
    });

    it('should be false if the document type is servable and has servedAt', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            docketEntries: [
              {
                docketEntryId,
                documentTitle: 'Some Stuff',
                documentType: 'Order',
                eventCode: 'O',
                isOnDocketRecord: true,
                servedAt: '2019-03-01T21:40:46.415Z',
              },
            ],
          },
          permissions: {
            SERVE_DOCUMENT: false,
          },
          viewerDocumentToDisplay: {
            docketEntryId,
          },
        },
      });

      expect(result.showNotServed).toEqual(false);
    });
  });

  describe('showServeCourtIssuedDocumentButton', () => {
    const docketEntryId = applicationContext.getUniqueId();

    it('should be true if the document type is a servable court issued document that does not have a served at', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            docketEntries: [
              {
                docketEntryId,
                documentTitle: 'Some Stuff',
                documentType: 'Order',
                eventCode: 'O',
                isOnDocketRecord: true,
              },
            ],
          },
          permissions: {
            SERVE_DOCUMENT: true,
          },
          viewerDocumentToDisplay: {
            docketEntryId,
          },
        },
      });

      expect(result.showServeCourtIssuedDocumentButton).toEqual(true);
    });

    it('should be false if the document type is not a court issued document', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            docketEntries: [
              {
                docketEntryId,
                documentTitle: 'Some Stuff',
                documentType: 'Petition',
                eventCode: 'P',
                isOnDocketRecord: true,
              },
            ],
          },
          permissions: {
            SERVE_DOCUMENT: true,
          },
          viewerDocumentToDisplay: {
            docketEntryId,
          },
        },
      });

      expect(result.showServeCourtIssuedDocumentButton).toEqual(false);
    });

    it('should be false if the document type is a servable court issued document and has servedAt', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            docketEntries: [
              {
                docketEntryId,
                documentTitle: 'Some Stuff',
                documentType: 'Order',
                eventCode: 'O',
                isOnDocketRecord: true,
                servedAt: '2019-03-01T21:40:46.415Z',
              },
            ],
          },
          permissions: {
            SERVE_DOCUMENT: true,
          },
          viewerDocumentToDisplay: {
            docketEntryId,
          },
        },
      });

      expect(result.showServeCourtIssuedDocumentButton).toEqual(false);
    });

    it('should be false if the document type is a servable court issued document without servedAt but the user does not have permission to serve the document', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            docketEntries: [
              {
                docketEntryId,
                documentTitle: 'Some Stuff',
                documentType: 'Order',
                eventCode: 'O',
                isOnDocketRecord: true,
                servedAt: '2019-03-01T21:40:46.415Z',
              },
            ],
          },
          permissions: {
            SERVE_DOCUMENT: false,
          },
          viewerDocumentToDisplay: {
            docketEntryId,
          },
        },
      });

      expect(result.showServeCourtIssuedDocumentButton).toEqual(false);
    });
  });

  describe('showServePaperFiledDocumentButton', () => {
    const docketEntryId = applicationContext.getUniqueId();

    it('should be true if the document type is an external document (and not a Petition) that does not have a served at and permisisons.SERVE_DOCUMENT is true', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            docketEntries: [
              {
                docketEntryId,
                documentTitle: 'Some Stuff',
                documentType: 'Answer',
                eventCode: 'A',
                isOnDocketRecord: true,
              },
            ],
          },
          permissions: {
            SERVE_DOCUMENT: true,
          },
          viewerDocumentToDisplay: {
            docketEntryId,
          },
        },
      });

      expect(result.showServePaperFiledDocumentButton).toEqual(true);
    });

    it('should be false if the document type is not an external document', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            docketEntries: [
              {
                docketEntryId,
                documentTitle: 'Some Stuff',
                documentType: 'Order',
                eventCode: 'O',
                isOnDocketRecord: true,
              },
            ],
          },
          permissions: {
            SERVE_DOCUMENT: true,
          },
          viewerDocumentToDisplay: {
            docketEntryId,
          },
        },
      });

      expect(result.showServePaperFiledDocumentButton).toEqual(false);
    });

    it('should be false if the document type is an external document and has servedAt', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            docketEntries: [
              {
                docketEntryId,
                documentTitle: 'Some Stuff',
                documentType: 'Answer',
                eventCode: 'A',
                isOnDocketRecord: true,
                servedAt: '2019-03-01T21:40:46.415Z',
              },
            ],
          },
          permissions: {
            SERVE_DOCUMENT: true,
          },
          viewerDocumentToDisplay: {
            docketEntryId,
          },
        },
      });

      expect(result.showServePaperFiledDocumentButton).toEqual(false);
    });

    it('should be false if the document type is an external document without servedAt but the user does not have permission to serve the document', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            docketEntries: [
              {
                docketEntryId,
                documentTitle: 'Some Stuff',
                documentType: 'Answer',
                eventCode: 'A',
                isOnDocketRecord: true,
              },
            ],
          },
          permissions: {
            SERVE_DOCUMENT: false,
          },
          viewerDocumentToDisplay: {
            docketEntryId,
          },
        },
      });

      expect(result.showServePaperFiledDocumentButton).toEqual(false);
    });
  });

  describe('showServePetitionButton', () => {
    it('should be false if the document is a served Petition document and the user has SERVE_PETITION permission', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            correspondence: [],
            docketEntries: [
              {
                docketEntryId: '123',
                documentType: 'Petition',
                entityName: 'Document',
                eventCode: 'P',
                isOnDocketRecord: true,
                servedAt: '2019-03-01T21:40:46.415Z',
              },
            ],
          },
          permissions: {
            SERVE_PETITION: true,
          },
          viewerDocumentToDisplay: {
            docketEntryId: '123',
          },
        },
      });

      expect(result.showServePetitionButton).toEqual(false);
    });

    it('should be false if the document is a not-served Petition document and the user does not have SERVE_PETITION permission', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            correspondence: [],
            docketEntries: [
              {
                docketEntryId: '123',
                documentType: 'Petition',
                entityName: 'Document',
                eventCode: 'P',
                isOnDocketRecord: true,
              },
            ],
          },
          permissions: {
            SERVE_PETITION: false,
          },
          viewerDocumentToDisplay: {
            docketEntryId: '123',
          },
        },
      });

      expect(result.showServePetitionButton).toEqual(false);
    });

    it('should be true if the document is a not-served Petition document and the user has SERVE_PETITION permission', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            correspondence: [],
            docketEntries: [
              {
                docketEntryId: '123',
                documentType: 'Petition',
                entityName: 'Document',
                eventCode: 'P',
                isOnDocketRecord: true,
              },
            ],
          },
          permissions: {
            SERVE_PETITION: true,
          },
          viewerDocumentToDisplay: {
            docketEntryId: '123',
          },
        },
      });

      expect(result.showServePetitionButton).toEqual(true);
    });
  });

  describe('showSignStipulatedDecisionButton', () => {
    it('should be true if the eventCode is PSDE and the SDEC eventCode is not in the documents', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            correspondence: [],
            docketEntries: [
              {
                docketEntryId: '123',
                documentType: 'Proposed Stipulated Decision',
                entityName: 'Document',
                eventCode: 'PSDE',
                isOnDocketRecord: true,
              },
            ],
          },
          permissions: {},
          viewerDocumentToDisplay: {
            docketEntryId: '123',
          },
        },
      });

      expect(result.showSignStipulatedDecisionButton).toEqual(true);
    });

    it('should be true if the document code is PSDE and an archived SDEC eventCode is in the documents', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            correspondence: [],
            docketEntries: [
              {
                docketEntryId: '123',
                documentType: 'Proposed Stipulated Decision',
                entityName: 'Document',
                eventCode: 'PSDE',
                isOnDocketRecord: true,
              },
              {
                archived: true,
                docketEntryId: '234',
                documentType: 'Stipulated Decision',
                entityName: 'Document',
                eventCode: 'SDEC',
              },
            ],
          },
          permissions: {},
          viewerDocumentToDisplay: {
            docketEntryId: '123',
          },
        },
      });

      expect(result.showSignStipulatedDecisionButton).toEqual(true);
    });

    it('should be false if the document code is PSDE and the SDEC eventCode is in the documents (and is not archived)', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            correspondence: [],
            docketEntries: [
              {
                docketEntryId: '123',
                documentType: 'Proposed Stipulated Decision',
                entityName: 'Document',
                eventCode: 'PSDE',
                isOnDocketRecord: true,
              },
              {
                docketEntryId: '234',
                documentType: 'Stipulated Decision',
                entityName: 'Document',
                eventCode: 'SDEC',
              },
            ],
          },
          permissions: {},
          viewerDocumentToDisplay: {
            docketEntryId: '123',
          },
        },
      });

      expect(result.showSignStipulatedDecisionButton).toEqual(false);
    });

    it('should be false if the eventCode is not PSDE', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            correspondence: [],
            docketEntries: [
              {
                docketEntryId: '123',
                documentType: 'Answer',
                entityName: 'Document',
                eventCode: 'A',
                isOnDocketRecord: true,
              },
            ],
          },
          permissions: {},
          viewerDocumentToDisplay: {
            docketEntryId: '123',
          },
        },
      });

      expect(result.showSignStipulatedDecisionButton).toEqual(false);
    });
  });

  it('should show stricken information if the associated document has been stricken', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentTitle: 'Petition',
              documentType: 'Petition',
              index: 1,
              isOnDocketRecord: true,
              isStricken: true,
            },
          ],
        },
        permissions: {
          SERVE_DOCUMENT: false,
        },
        viewerDocumentToDisplay: {
          docketEntryId: 'abc',
        },
      },
    });

    expect(result.showStricken).toEqual(true);
  });

  it('should show stricken information if the docket entry has been stricken', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentTitle: 'Petition',
              documentType: 'Petition',
              index: 1,
              isOnDocketRecord: true,
              isStricken: true,
            },
          ],
        },
        permissions: {
          SERVE_DOCUMENT: false,
        },
        viewerDocumentToDisplay: {
          docketEntryId: 'abc',
          isStricken: true,
        },
      },
    });

    expect(result.showStricken).toEqual(true);
  });
});
