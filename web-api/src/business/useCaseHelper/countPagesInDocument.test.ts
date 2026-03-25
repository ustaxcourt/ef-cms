import { testPdfDoc } from '../../../../shared/src/business/test/getFakeFile';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { countPagesInDocument } from './countPagesInDocument';

describe('countPagesInDocument', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockResolvedValue(testPdfDoc);
  });

  it('returns page count of a PDF document referenced by docketEntryId', async () => {
    const pageCount = await countPagesInDocument({
      applicationContext,
      documentStorageId: 'document-id-123',
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

  it('should throw an Error if documentBytes and documentStorageId are undefined', async () => {
    await expect(
      countPagesInDocument({
        applicationContext,
      }),
    ).rejects.toThrow();
  });
});
