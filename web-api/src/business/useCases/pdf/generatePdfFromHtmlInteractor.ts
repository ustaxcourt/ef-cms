import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const generatePdfFromHtmlInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    contentHtml,
    displayHeaderFooter = true,
    docketNumber,
    footerHtml,
    headerHtml,
    overwriteFooter,
  }: {
    contentHtml: string;
    displayHeaderFooter?: boolean;
    docketNumber?: string;
    footerHtml?: string;
    headerHtml?: string;
    overwriteFooter?: boolean;
  },
): Promise<Uint8Array> => {
  if (applicationContext.environment.stage === 'local') {
    const browserLocal = await applicationContext.getChromiumBrowser();

    const result = await applicationContext
      .getUseCaseHelpers()
      .generatePdfFromHtmlHelper(
        applicationContext,
        {
          contentHtml,
          displayHeaderFooter,
          docketNumber,
          footerHtml,
          headerHtml,
          overwriteFooter,
        },
        browserLocal,
      );

    await browserLocal.close();

    return result;
  }

  const { currentColor, region, stage } = applicationContext.environment;
  const client = new LambdaClient({
    region,
  });
  const command = new InvokeCommand({
    FunctionName: `pdf_generator_${stage}_${currentColor}`,
    InvocationType: 'RequestResponse',
    Payload: Buffer.from(
      JSON.stringify({
        contentHtml,
        displayHeaderFooter,
        docketNumber,
        footerHtml,
        headerHtml,
        overwriteFooter,
      }),
    ),
  });

  const response = await client.send(command);
  const textDecoder = new TextDecoder('utf-8');
  const responseStr = textDecoder.decode(response.Payload);
  const key = JSON.parse(responseStr);

  return await applicationContext.getPersistenceGateway().getDocument({
    applicationContext,
    key,
    useTempBucket: true,
  });
};
