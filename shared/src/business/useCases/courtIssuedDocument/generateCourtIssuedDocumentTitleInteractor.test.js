const {
  CourtIssuedDocumentFactory,
} = require('../../entities/courtIssuedDocument/CourtIssuedDocumentFactory');
const {
  generateCourtIssuedDocumentTitleInteractor,
} = require('./generateCourtIssuedDocumentTitleInteractor');
const { Document } = require('../../entities/Document');

describe('generateCourtIssuedDocumentTitleInteractor', () => {
  let applicationContext;

  it('generates a document title from passed metadata', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getEntityConstructors: () => ({
        CourtIssuedDocumentFactory,
        Document,
      }),
    };
    const title = await generateCourtIssuedDocumentTitleInteractor({
      applicationContext,
      documentMetadata: {
        documentTitle: 'Order fixing amount of bond at [Anything]',
        documentType: 'OFAB - Order fixing amount of bond',
        eventCode: 'OFAB',
        freeText: '100 million dollars',
        scenario: 'Type A',
      },
    });
    expect(title).toEqual('Order fixing amount of bond at 100 million dollars');
  });

  it('does not generate a document title if the passed in documentMetadata is not valid', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getEntityConstructors: () => ({
        CourtIssuedDocumentFactory,
        Document,
      }),
    };
    const title = await generateCourtIssuedDocumentTitleInteractor({
      applicationContext,
      documentMetadata: {
        freeText: '100 million dollars',
      },
    });
    expect(title).toBeUndefined();
  });

  it('resets the document title to the default "bracketed" state before generating the title', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getEntityConstructors: () => ({
        CourtIssuedDocumentFactory,
        Document,
      }),
    };
    const title = await generateCourtIssuedDocumentTitleInteractor({
      applicationContext,
      documentMetadata: {
        documentTitle: 'NOT THE ORIGINAL TITLE',
        documentType: 'OFAB - Order fixing amount of bond',
        eventCode: 'OFAB',
        freeText: '100 million dollars',
        scenario: 'Type A',
      },
    });
    expect(title).toEqual('Order fixing amount of bond at 100 million dollars');
  });
});
