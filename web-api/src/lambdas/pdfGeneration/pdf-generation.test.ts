jest.mock('@web-api/dispatchers/sqs/rescheduleLambda', () => ({
  rescheduleLambda: jest.fn(),
}));
jest.mock('@web-api/business/utilities/chromium/getChromiumBrowser', () => ({
  getChromiumBrowser: jest.fn(),
}));
jest.mock(
  '@web-api/business/useCaseHelper/generatePdfFromHtmlHelper',
  () => ({
    generatePdfFromHtmlHelper: jest.fn(),
  }),
);
jest.mock('@web-api/persistence/s3/saveDocumentFromLambda', () => ({
  saveDocumentFromLambda: jest.fn(),
}));

import { handler as pdfGenerationHandler } from './pdf-generation';
import { rescheduleLambda as rescheduleLambdaMock } from '@web-api/dispatchers/sqs/rescheduleLambda';

const rescheduleLambda = jest.mocked(rescheduleLambdaMock);

describe('pdf-generation handler', () => {
  const ORIGINAL_READ_ONLY_MODE = process.env.READ_ONLY_MODE;

  afterEach(() => {
    process.env.READ_ONLY_MODE = ORIGINAL_READ_ONLY_MODE;
  });

  it('reschedules itself with a 180-second delay when in read-only mode and does not invoke the browser', async () => {
    process.env.READ_ONLY_MODE = 'true';
    const event = { contentHtml: '<html></html>' } as any;

    const result = await pdfGenerationHandler(event);

    expect(rescheduleLambda).toHaveBeenCalledWith(
      expect.anything(),
      { event },
      180,
    );
    expect(result).toBeUndefined();
  });
});
