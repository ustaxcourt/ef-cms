import { applicationContext } from '../test/createTestApplicationContext';
import { scrapePdfContents } from './scrapePdfContents';

describe('scrapePdfContents', () => {
  beforeEach(() => {
    applicationContext.getPdfJs().getDocument.mockReturnValue({
      promise: {
        getPage: jest.fn().mockResolvedValue({
          getTextContent: jest.fn().mockResolvedValue({
            items: [
              {
                str: 'this is the content',
                transform: [0, 0, 0, 0, 'transform'],
              },
              {
                str: 'this is some more content',
                transform: [0, 0, 0, 0, 'transform'],
              },
            ],
          }),
        }),
        numPages: 1,
      },
    });
  });

  it('scrapes the pdf contents', async () => {
    const contents = await scrapePdfContents({
      applicationContext,
      pdfBuffer: [],
    });

    expect(contents.trim()).toEqual(
      'this is the contentthis is some more content',
    );
  });

  it('fails to scrape the pdf contents', async () => {
    applicationContext.getPdfJs().getDocument.mockImplementation(() => {
      throw new Error('what');
    });
    await expect(
      scrapePdfContents({
        applicationContext,
        pdfBuffer: [],
      }),
    ).rejects.toThrow('error scraping PDF');
  });
});
