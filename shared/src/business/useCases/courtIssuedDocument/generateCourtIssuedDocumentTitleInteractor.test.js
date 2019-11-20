const {
  CourtIssuedDocumentFactory,
} = require('../../entities/courtIssuedDocument/CourtIssuedDocumentFactory');
const {
  generateCourtIssuedDocumentTitleInteractor,
} = require('./generateCourtIssuedDocumentTitleInteractor');

describe('generateCourtIssuedDocumentTitleInteractor', () => {
  let applicationContext;

  it('generates a document title from passed metadata', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getEntityConstructors: () => ({
        CourtIssuedDocumentFactory,
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
});
