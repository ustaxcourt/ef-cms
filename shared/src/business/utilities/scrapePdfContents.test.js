import { applicationContext } from '../test/createTestApplicationContext';
import { scrapePdfContents } from './scrapePdfContents';

const exampleOrderPdf = {
  items: [
    {
      dir: 'ltr',
      fontName: 'g_d0_f1',
      hasEOL: false,
      height: 12,
      str: '10',
      transform: [12, 0, 0, 12, 360.1417, 649.6668],
      width: 12.000000000000004,
    },
    {
      dir: 'ltr',
      fontName: 'g_d0_f1',
      hasEOL: false,
      height: 12,
      str: '6',
      transform: [12, 0, 0, 12, 372.1417, 649.6668],
      width: 6.084,
    },
    {
      dir: 'ltr',
      fontName: 'g_d0_f1',
      hasEOL: false,
      height: 12,
      str: '-',
      transform: [12, 0, 0, 12, 378.1417, 649.6668],
      width: 3.6719999999999997,
    },
    {
      dir: 'ltr',
      fontName: 'g_d0_f1',
      hasEOL: false,
      height: 12,
      str: '21',
      transform: [12, 0, 0, 12, 381.9817, 649.6668],
      width: 12.000000000000004,
    },
  ],
  styles: {
    g_d0_f1: {
      ascent: 0.9521484375,
      descent: -0.2685546875,
      fontFamily: 'sans-serif',
      vertical: false,
    },
  },
};

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

  it('scrapes pdf and adds spaces between words', async () => {
    applicationContext.getPdfJs().getDocument.mockReturnValue({
      promise: {
        getPage: jest.fn().mockResolvedValue({
          getTextContent: jest.fn().mockResolvedValue(exampleOrderPdf),
        }),
        numPages: 1,
      },
    });

    const contents = await scrapePdfContents({
      applicationContext,
      pdfBuffer: [],
    });

    expect(contents.trim()).toEqual('106-21');
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
    ).rejects.toThrow('Error scraping PDF with PDF.JS v1');
  });
});
