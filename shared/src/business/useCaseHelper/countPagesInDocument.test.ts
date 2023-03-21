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

  it('returns page count of a PDF document referenced by docketEntryId', async () => {
    const pageCount = await countPagesInDocument({
      applicationContext,
      docketEntryId: 'document-id-123',
    });

    expect(pageCount).toEqual(1);
  });

  it('returns page count of a PDF document referenced by documentBytes', async () => {
    const pageCount = await countPagesInDocument({
      applicationContext,
      documentBytes: testPdfDoc,
    });

    expect(pageCount).toEqual(1);
  });
});
