import { testPdfDoc } from '../test/getFakeFile';

import { applicationContext } from '../test/createTestApplicationContext';
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
