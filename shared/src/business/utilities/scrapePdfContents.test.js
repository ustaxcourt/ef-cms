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
                transform: [0, 0, 0, 0, 0, 'transform'],
              },
              {
                str: 'this is some more content',
                transform: [0, 0, 0, 0, 0, 'transformed'],
              },
              {
                str: '',
                transform: [0, 0, 0, 0, 0, false],
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
      `this is the content
this is some more content`,
    );
  });

  it('scrapes the pdf that has no contents', async () => {
    applicationContext.getPdfJs().getDocument.mockReturnValue({
      promise: {
        getPage: jest.fn().mockResolvedValue({
          getTextContent: jest.fn().mockResolvedValue({
            items: [],
          }),
        }),
        numPages: 1,
      },
    });

    const contents = await scrapePdfContents({
      applicationContext,
      pdfBuffer: [],
    });

    expect(contents).toEqual('');
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
