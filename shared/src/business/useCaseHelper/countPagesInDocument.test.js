const {
  applicationContext,
  testPdfDoc,
} = require('../test/createTestApplicationContext');
const { countPagesInDocument } = require('./countPagesInDocument');

describe('countPagesInDocument', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockResolvedValue(testPdfDoc);
  });

  it('returns page count of a PDF document', async () => {
    const pageCount = await countPagesInDocument({
      applicationContext,
      documentId: 'document-id-123',
    });

    expect(pageCount).toEqual(1);
  });
});
