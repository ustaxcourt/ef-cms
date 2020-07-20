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

  it('should return an empty object if the requested documentId is not found in the docket record', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        caseDetail: {
          docketRecord: [
            {
              description: 'Petition',
              documentId: 'abc',
              index: 1,
            },
          ],
          documents: [
            {
              documentId: 'abc',
              documentType: 'Petition',
            },
          ],
        },
        permissions: {
          SERVE_DOCUMENT: false,
        },
        viewerDocumentToDisplay: {
          documentId: '999',
        },
      },
    });
    expect(result).toEqual({});
  });

  it('should return the document description', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        caseDetail: {
          docketRecord: [
            {
              description: 'Petition',
              documentId: 'abc',
              index: 1,
            },
          ],
          documents: [
            {
              documentId: 'abc',
              documentType: 'Petition',
            },
          ],
        },

        permissions: {
          SERVE_DOCUMENT: false,
        },
        viewerDocumentToDisplay: {
          documentId: 'abc',
        },
      },
    });
    expect(result.description).toEqual('Petition');
  });

  it('should return a filed label with the filing date and party', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        caseDetail: {
          docketRecord: [
            {
              description: 'Petition',
              documentId: 'abc',
              index: 1,
            },
          ],
          documents: [
            {
              createdAt: '2018-11-21T20:49:28.192Z',
              documentId: 'abc',
              documentType: 'Petition',
              filedBy: 'Test Petitioner',
            },
          ],
        },
        permissions: {
          SERVE_DOCUMENT: false,
        },

        viewerDocumentToDisplay: {
          documentId: 'abc',
        },
      },
    });
    expect(result.filedLabel).toEqual('Filed 11/21/18 by Test Petitioner');
  });

  it('should return an empty filed label for court-issued documents', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        caseDetail: {
          docketRecord: [
            {
              description: 'Petition',
              documentId: 'abc',
              index: 1,
            },
          ],
          documents: [
            {
              createdAt: '2018-11-22T20:49:28.192Z',
              documentId: 'abc',
              documentType: 'Order',
            },
          ],
        },

        permissions: {
          SERVE_DOCUMENT: false,
        },
        viewerDocumentToDisplay: {
          documentId: 'abc',
        },
      },
    });
    expect(result.filedLabel).toEqual('');
  });

  it('should return showSealedInBlackstone true or false based on whether the document has isLegacySealed', () => {
    let result = runCompute(documentViewerHelper, {
      state: {
        caseDetail: {
          docketRecord: [
            {
              description: 'Petition',
              documentId: 'abc',
              index: 1,
            },
          ],
          documents: [
            {
              documentId: 'abc',
              documentType: 'Petition',
              isLegacySealed: false,
            },
          ],
        },

        permissions: {
          SERVE_DOCUMENT: false,
        },
        viewerDocumentToDisplay: {
          documentId: 'abc',
        },
      },
    });
    expect(result.showSealedInBlackstone).toEqual(false);

    result = runCompute(documentViewerHelper, {
      state: {
        caseDetail: {
          docketRecord: [
            {
              description: 'Petition',
              documentId: 'abc',
              index: 1,
            },
          ],
          documents: [
            {
              documentId: 'abc',
              documentType: 'Petition',
              isLegacySealed: true,
            },
          ],
        },

        permissions: {
          SERVE_DOCUMENT: false,
        },
        viewerDocumentToDisplay: {
          documentId: 'abc',
        },
      },
    });
    expect(result.showSealedInBlackstone).toEqual(true);
  });

  it('should return a served label if the document has been served', () => {
    let result = runCompute(documentViewerHelper, {
      state: {
        caseDetail: {
          docketRecord: [
            {
              description: 'Petition',
              documentId: 'abc',
              index: 1,
            },
          ],
          documents: [
            {
              documentId: 'abc',
              documentType: 'Petition',
            },
          ],
        },
        permissions: {
          SERVE_DOCUMENT: false,
        },
        viewerDocumentToDisplay: {
          documentId: 'abc',
        },
      },
    });
    expect(result.servedLabel).toEqual('');

    result = runCompute(documentViewerHelper, {
      state: {
        caseDetail: {
          docketRecord: [
            {
              description: 'Petition',
              documentId: 'abc',
              index: 1,
            },
          ],
          documents: [
            {
              documentId: 'abc',
              documentType: 'Petition',
              servedAt: '2018-11-21T20:49:28.192Z',
            },
          ],
        },

        permissions: {
          SERVE_DOCUMENT: false,
        },
        viewerDocumentToDisplay: {
          documentId: 'abc',
        },
      },
    });
    expect(result.servedLabel).toEqual('Served 11/21/18');
  });

  describe('showNotServed', () => {
    const documentId = applicationContext.getUniqueId();

    it('should be true if the document type is servable and does not have a servedAt', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            docketRecord: [{ documentId }],
            documents: [
              {
                documentId,
                documentTitle: 'Some Stuff',
                documentType: 'Order',
                eventCode: 'O',
              },
            ],
          },
          permissions: {
            SERVE_DOCUMENT: false,
          },
          viewerDocumentToDisplay: {
            documentId,
          },
        },
      });

      expect(result.showNotServed).toEqual(true);
    });

    it('should be false if the document type is unservable', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            docketRecord: [{ documentId }],
            documents: [
              {
                documentId,
                documentTitle: 'Some Stuff',
                documentType: 'Corrected Transcript',
                eventCode: 'CTRA',
              },
            ],
          },
          permissions: {
            SERVE_DOCUMENT: false,
          },
          viewerDocumentToDisplay: {
            documentId,
          },
        },
      });

      expect(result.showNotServed).toEqual(false);
    });

    it('should be false if the document type is servable and has servedAt', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            docketRecord: [{ documentId }],
            documents: [
              {
                documentId,
                documentTitle: 'Some Stuff',
                documentType: 'Order',
                eventCode: 'O',
                servedAt: '2019-03-01T21:40:46.415Z',
              },
            ],
          },
          permissions: {
            SERVE_DOCUMENT: false,
          },
          viewerDocumentToDisplay: {
            documentId,
          },
        },
      });

      expect(result.showNotServed).toEqual(false);
    });
  });

  describe('showServeCourtIssuedDocumentButton', () => {
    const documentId = applicationContext.getUniqueId();

    it('should be true if the document type is a servable court issued document that does not have a served at', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            docketRecord: [{ documentId }],
            documents: [
              {
                documentId,
                documentTitle: 'Some Stuff',
                documentType: 'Order',
                eventCode: 'O',
              },
            ],
          },
          permissions: {
            SERVE_DOCUMENT: true,
          },
          viewerDocumentToDisplay: {
            documentId,
          },
        },
      });

      expect(result.showServeCourtIssuedDocumentButton).toEqual(true);
    });

    it('should be false if the document type is not a court issued document', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            docketRecord: [{ documentId }],
            documents: [
              {
                documentId,
                documentTitle: 'Some Stuff',
                documentType: 'Petition',
                eventCode: 'P',
              },
            ],
          },
          permissions: {
            SERVE_DOCUMENT: true,
          },
          viewerDocumentToDisplay: {
            documentId,
          },
        },
      });

      expect(result.showServeCourtIssuedDocumentButton).toEqual(false);
    });

    it('should be false if the document type is a servable court issued document and has servedAt', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            docketRecord: [{ documentId }],
            documents: [
              {
                documentId,
                documentTitle: 'Some Stuff',
                documentType: 'Order',
                eventCode: 'O',
                servedAt: '2019-03-01T21:40:46.415Z',
              },
            ],
          },
          permissions: {
            SERVE_DOCUMENT: true,
          },
          viewerDocumentToDisplay: {
            documentId,
          },
        },
      });

      expect(result.showServeCourtIssuedDocumentButton).toEqual(false);
    });

    it('should be false if the document type is a servable court issued document without servedAt but the user does not have permission to serve the document', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            docketRecord: [{ documentId }],
            documents: [
              {
                documentId,
                documentTitle: 'Some Stuff',
                documentType: 'Order',
                eventCode: 'O',
                servedAt: '2019-03-01T21:40:46.415Z',
              },
            ],
          },
          permissions: {
            SERVE_DOCUMENT: false,
          },
          viewerDocumentToDisplay: {
            documentId,
          },
        },
      });

      expect(result.showServeCourtIssuedDocumentButton).toEqual(false);
    });
  });

  describe('showServePaperFiledDocumentButton', () => {
    const documentId = applicationContext.getUniqueId();

    it('should be true if the document type is an external document (and not a Petition) that does not have a served at and permisisons.SERVE_DOCUMENT is true', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            docketRecord: [{ documentId }],
            documents: [
              {
                documentId,
                documentTitle: 'Some Stuff',
                documentType: 'Answer',
                eventCode: 'A',
              },
            ],
          },
          permissions: {
            SERVE_DOCUMENT: true,
          },
          viewerDocumentToDisplay: {
            documentId,
          },
        },
      });

      expect(result.showServePaperFiledDocumentButton).toEqual(true);
    });

    it('should be false if the document type is not an external document', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            docketRecord: [{ documentId }],
            documents: [
              {
                documentId,
                documentTitle: 'Some Stuff',
                documentType: 'Order',
                eventCode: 'O',
              },
            ],
          },
          permissions: {
            SERVE_DOCUMENT: true,
          },
          viewerDocumentToDisplay: {
            documentId,
          },
        },
      });

      expect(result.showServePaperFiledDocumentButton).toEqual(false);
    });

    it('should be false if the document type is an external document and has servedAt', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            docketRecord: [{ documentId }],
            documents: [
              {
                documentId,
                documentTitle: 'Some Stuff',
                documentType: 'Answer',
                eventCode: 'A',
                servedAt: '2019-03-01T21:40:46.415Z',
              },
            ],
          },
          permissions: {
            SERVE_DOCUMENT: true,
          },
          viewerDocumentToDisplay: {
            documentId,
          },
        },
      });

      expect(result.showServePaperFiledDocumentButton).toEqual(false);
    });

    it('should be false if the document type is an external document without servedAt but the user does not have permission to serve the document', () => {
      const result = runCompute(documentViewerHelper, {
        state: {
          caseDetail: {
            docketRecord: [{ documentId }],
            documents: [
              {
                documentId,
                documentTitle: 'Some Stuff',
                documentType: 'Answer',
                eventCode: 'A',
                servedAt: '2019-03-01T21:40:46.415Z',
              },
            ],
          },
          permissions: {
            SERVE_DOCUMENT: false,
          },
          viewerDocumentToDisplay: {
            documentId,
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
            docketRecord: [
              {
                documentId: '123',
              },
            ],
            documents: [
              {
                documentId: '123',
                documentType: 'Petition',
                entityName: 'Document',
                eventCode: 'P',
                servedAt: '2019-03-01T21:40:46.415Z',
              },
            ],
          },
          permissions: {
            SERVE_PETITION: true,
          },
          viewerDocumentToDisplay: {
            documentId: '123',
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
            docketRecord: [
              {
                documentId: '123',
              },
            ],
            documents: [
              {
                documentId: '123',
                documentType: 'Petition',
                entityName: 'Document',
                eventCode: 'P',
              },
            ],
          },
          permissions: {
            SERVE_PETITION: false,
          },
          viewerDocumentToDisplay: {
            documentId: '123',
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
            docketRecord: [
              {
                documentId: '123',
              },
            ],
            documents: [
              {
                documentId: '123',
                documentType: 'Petition',
                entityName: 'Document',
                eventCode: 'P',
              },
            ],
          },
          permissions: {
            SERVE_PETITION: true,
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showServePetitionButton).toEqual(true);
    });
  });
});
