import { LambdaClient } from '@aws-sdk/client-lambda';
import { applicationContext } from '../test/createTestApplicationContext';
import { generatePdfFromHtmlInteractor } from '@shared/business/useCases/generatePdfFromHtmlInteractor';

const documentKey = 'a2bf0e93-74e2-496c-832f-ec5e77900509';
const lambdaClientMock = jest
  .spyOn(LambdaClient.prototype, 'send')
  .mockImplementation(() => {
    return {
      Payload: Buffer.from(JSON.stringify({ key: documentKey })),
    };
  });

describe('generatePdfFromHtmlInteractor', () => {
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

    expect(lambdaClientMock).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).toHaveBeenCalled();
  });
});
