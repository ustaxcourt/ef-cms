jest.mock('@shared/business/utilities/chromium/getChromiumBrowser', () => ({
  getChromiumBrowser: jest.fn(),
}));
jest.mock('@web-api/business/useCaseHelper/generatePdfFromHtmlHelper', () => ({
  generatePdfFromHtmlHelper: jest.fn(),
}));
jest.mock('@web-api/persistence/s3/saveDocumentFromLambda', () => ({
  saveDocumentFromLambda: jest.fn(),
}));

import { generatePdfFromHtmlHelper as generatePdfFromHtmlHelperMock } from '@web-api/business/useCaseHelper/generatePdfFromHtmlHelper';
import { getChromiumBrowser as getChromiumBrowserMock } from '@shared/business/utilities/chromium/getChromiumBrowser';
import { handler as pdfGenerationHandler } from './pdf-generation';
import { saveDocumentFromLambda as saveDocumentFromLambdaMock } from '@web-api/persistence/s3/saveDocumentFromLambda';

const getChromiumBrowser = jest.mocked(getChromiumBrowserMock);
const generatePdfFromHtmlHelper = jest.mocked(generatePdfFromHtmlHelperMock);
const saveDocumentFromLambda = jest.mocked(saveDocumentFromLambdaMock);

describe('pdf-generation handler', () => {
  const ORIGINAL_READ_ONLY_MODE = process.env.READ_ONLY_MODE;

  beforeEach(() => {
    const browser = {
      pages: jest.fn().mockResolvedValue([]),
    } as any;
    getChromiumBrowser.mockResolvedValue(browser);
    generatePdfFromHtmlHelper.mockResolvedValue(new Uint8Array() as any);
    saveDocumentFromLambda.mockResolvedValue(undefined as any);
  });

  afterEach(() => {
    process.env.READ_ONLY_MODE = ORIGINAL_READ_ONLY_MODE;
    jest.clearAllMocks();
  });

  it('renders the pdf and returns a tempId regardless of READ_ONLY_MODE because the handler is invoked synchronously and only writes to S3', async () => {
    process.env.READ_ONLY_MODE = 'true';
    const event = { contentHtml: '<html></html>' } as any;

    const result = await pdfGenerationHandler(event);

    expect(getChromiumBrowser).toHaveBeenCalledTimes(1);
    expect(generatePdfFromHtmlHelper).toHaveBeenCalledTimes(1);
    expect(saveDocumentFromLambda).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ tempId: expect.any(String) });
  });

  it('renders the pdf normally when not in read-only mode', async () => {
    process.env.READ_ONLY_MODE = 'false';
    const event = { contentHtml: '<html></html>' } as any;

    const result = await pdfGenerationHandler(event);

    expect(result).toEqual({ tempId: expect.any(String) });
  });
});
