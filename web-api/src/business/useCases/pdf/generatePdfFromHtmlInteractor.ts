import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { PdfGenerationResult } from '@web-api/lambdas/pdfGeneration/pdf-generation';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getChromiumBrowser } from '@shared/business/utilities/getChromiumBrowser';
import { GeneratePdfRequest } from '@web-api/business/useCaseHelper/generatePdfFromHtmlHelper';

export const generatePdfFromHtmlInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    contentHtml,
    displayHeaderFooter = true,
    docketNumber,
    footerHtml,
    headerHtml,
    overwriteFooter,
  }: GeneratePdfRequest,
): Promise<Uint8Array> => {
  if (applicationContext.environment.stage === 'local') {
    const browserLocal = await getChromiumBrowser();

    const result = await applicationContext
      .getUseCaseHelpers()
      .generatePdfFromHtmlHelper(
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
        `Error: docketNumber ${docketNumber} Unable to generate pdf. Check pdf_generator_${stage}_${currentColor} lambda with requestId: ${response.$metadata?.requestId} for errors.`,
      );
    }
    key = pdfGenerationResult.tempId;
  } catch (e) {
    throw new Error(
      `Error: docketNumber ${docketNumber} Unable to generate pdf. Check pdf_generator_${stage}_${currentColor} lambda with requestId: ${response.$metadata?.requestId} for errors.`,
    );
  }

  return await applicationContext.getPersistenceGateway().getDocument({
    applicationContext,
    key,
    useTempBucket: true,
  });
};
