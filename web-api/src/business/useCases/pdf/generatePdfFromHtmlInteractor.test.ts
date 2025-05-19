const mockLambdaClientSend = jest.fn();
jest.mock('@web-api/gateways/lambda/getLambdaClient', () => {
  class LambdaClient {
    send() {
      return mockLambdaClientSend();
    }
  }
  return { getLambdaClient: () => new LambdaClient() };
});
import { getChromiumBrowser } from '@shared/business/utilities/getChromiumBrowser';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generatePdfFromHtmlInteractor } from '@web-api/business/useCases/pdf/generatePdfFromHtmlInteractor';

const documentKey = 'a2bf0e93-74e2-496c-832f-ec5e77900509';

describe('generatePdfFromHtmlInteractor', () => {
  beforeEach(() => {
    mockLambdaClientSend.mockImplementation(() => {
      return {
        Payload: Buffer.from(JSON.stringify({ tempId: documentKey })),
      };
    });
  });

  it('should generate a pdf by opening a chromium browser and creating a pdf, when running locally', async () => {
    applicationContext.environment.stage = 'local';

    await generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: '<p>this is content</p>',
      displayHeaderFooter: false,
      docketNumber: '102-24',
      footerHtml: '<div>this is a footer</div>',
      headerHtml: '<span>this is a header</span>',
      overwriteFooter: false,
    });

    expect(
      applicationContext.getUseCaseHelpers().generatePdfFromHtmlHelper,
    ).toHaveBeenCalled();
    const browser = await getChromiumBrowser();
    await browser.close();
  });

  it('should generate a pdf by invoking a lambda when in a deployed environment', async () => {
    applicationContext.environment.stage = 'prod';

    await generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: '<p>this is content</p>',
      displayHeaderFooter: false,
      docketNumber: '102-24',
      footerHtml: '<div>this is a footer</div>',
      headerHtml: '<span>this is a header</span>',
      overwriteFooter: false,
    });

    expect(mockLambdaClientSend).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).toHaveBeenCalled();
  });

  it('should throw an error when the pdf generator lambda does not generate a file id', async () => {
    applicationContext.environment.stage = 'prod';
    applicationContext.environment.currentColor = 'blue';
    mockLambdaClientSend.mockImplementation(() => {
      return {
        Payload: Buffer.from(JSON.stringify({})),
      };
    });

    await expect(
      generatePdfFromHtmlInteractor(applicationContext, {
        contentHtml: '<p>this is content</p>',
        displayHeaderFooter: false,
        docketNumber: '102-24',
        footerHtml: '<div>this is a footer</div>',
        headerHtml: '<span>this is a header</span>',
        overwriteFooter: false,
      }),
    ).rejects.toThrow(
      `Unable to generate pdf. Check pdf_generator_${applicationContext.environment.stage}_${applicationContext.environment.currentColor} lambda with requestId: undefined for errors.`,
    );

    expect(mockLambdaClientSend).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).not.toHaveBeenCalled();
  });
});
