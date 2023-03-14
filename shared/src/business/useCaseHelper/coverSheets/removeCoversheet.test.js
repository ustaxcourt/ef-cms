const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../../test/mockCase');
const { removeCoversheet } = require('./removeCoversheet');
describe('removeCoversheet', () => {
  it('should throw an exception when the requested document cannot be found in S3', async () => {
    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () => {
        throw new Error('oh no');
      },
    });

    await expect(removeCoversheet(applicationContext, {})).rejects.toThrow();
  });

  it('should remove the coversheet from the provided docket entry`s pdf', async () => {
    const mockDocketEntryId = 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859';
    const numberOfPagesBeforeCoversheetRemoval = 2;

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        docketEntries: [
          {
            docketEntryId: mockDocketEntryId,
            docketNumber: MOCK_CASE.docketNumber,
            documentType: 'Answer',
            eventCode: 'A',
            filedBy: 'Test Petitioner',
            numberOfPages: numberOfPagesBeforeCoversheetRemoval,
            processingStatus: 'pending',
          },
        ],
      });
    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () => ({
        Body: testPdfDoc,
      }),
    });

    const result = await removeCoversheet(applicationContext, {
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(result.numberOfPages).toBe(numberOfPagesBeforeCoversheetRemoval - 1);
    expect(
      applicationContext.getDocumentGenerators().coverSheet,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateDocketEntry,
    ).toHaveBeenCalled();
  });
});
