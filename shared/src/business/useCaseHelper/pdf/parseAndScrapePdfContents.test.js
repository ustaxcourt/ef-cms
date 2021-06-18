const {
  applicationContext,
  getFakeFile,
} = require('../../test/createTestApplicationContext');
const { parseAndScrapePdfContents } = require('./parseAndScrapePdfContents');

describe('parseAndScrapePdfContents', () => {
  it('should parse pdf contents', async () => {
    await parseAndScrapePdfContents({
      applicationContext,
      pdfBuffer: getFakeFile,
    });

    expect(
      applicationContext.getUtilities().scrapePdfContents.mock.calls[0][0]
        .pdfBuffer instanceof ArrayBuffer,
    ).toEqual(true);
  });

  it('should throw an error if fails to parse pdf', async () => {
    applicationContext
      .getUtilities()
      .scrapePdfContents.mockImplementation(() => {
        throw new Error('error parsing pdf');
      });

    await expect(
      parseAndScrapePdfContents({
        applicationContext,
        pdfBuffer: getFakeFile,
      }),
    ).rejects.toThrow('error parsing pdf');
  });
});
