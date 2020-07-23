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
          viewerDocumentToDisplay: {
            documentId,
          },
        },
      });

      expect(result.showNotServed).toEqual(false);
    });
  });
});
