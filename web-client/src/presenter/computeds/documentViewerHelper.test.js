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
});
