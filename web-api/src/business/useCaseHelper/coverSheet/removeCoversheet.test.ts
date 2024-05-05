import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { removeCoversheet } from './removeCoversheet';
import { testPdfDoc } from '../../../../../shared/src/business/test/getFakeFile';

describe('removeCoversheet', () => {
  it('should throw an exception when the requested document cannot be found in S3', async () => {
    applicationContext
      .getStorageClient()
      .getObject.mockRejectedValue(new Error('oh no'));

    await expect(
      removeCoversheet(applicationContext, {
        docketEntryId: 'does-not-exist',
      }),
    ).rejects.toThrow();
  });

  it('should remove the coversheet from the provided docket entry`s pdf', async () => {
    const mockDocketEntryId = 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859';
    const numberOfPagesBeforeCoversheetRemoval = 2;

    applicationContext.getStorageClient().getObject.mockResolvedValue({
      Body: testPdfDoc,
    });

    const result = await removeCoversheet(applicationContext, {
      docketEntryId: mockDocketEntryId,
    });

    expect(result.numberOfPages).toBe(numberOfPagesBeforeCoversheetRemoval - 1);
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
  });
});
