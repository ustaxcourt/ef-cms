import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { PdfGenerationResult } from '@web-api/lambdas/pdfGeneration/pdf-generation';
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
  let key: string;
  try {
    const responseStr = textDecoder.decode(response.Payload);
    const pdfGenerationResult: PdfGenerationResult = JSON.parse(responseStr);
    if (!pdfGenerationResult.tempId) {
      throw new Error(
        `Unable to generate pdf. Check pdf_generator_${stage}_${currentColor} lambda for errors`,
      );
    }
    key = pdfGenerationResult.tempId;
  } catch (e) {
    throw new Error(
      `Unable to generate pdf. Check pdf_generator_${stage}_${currentColor} lambda for errors`,
    );
  }

  return await applicationContext.getPersistenceGateway().getDocument({
    applicationContext,
    key,
    useTempBucket: true,
  });
};
