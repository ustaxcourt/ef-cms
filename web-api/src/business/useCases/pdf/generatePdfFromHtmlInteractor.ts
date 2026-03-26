import { InvokeCommand } from '@aws-sdk/client-lambda';
import { PdfGenerationResult } from '@web-api/lambdas/pdfGeneration/pdf-generation';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getChromiumBrowser } from '@shared/business/utilities/chromium/getChromiumBrowser';
import { GeneratePdfRequest } from '@web-api/business/useCaseHelper/generatePdfFromHtmlHelper';
import { getLambdaClient } from '@web-api/gateways/lambda/getLambdaClient';

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
  const logDocket = docketNumber ?? 'unknown';

  if (applicationContext.environment.stage === 'local') {
    applicationContext.logger.info(
      `Starting get Chromium browser for PDF generation (docket ${logDocket})`,
    );

    const browserLocal = await getChromiumBrowser();

    applicationContext.logger.info(
      `Finished get Chromium browser for PDF generation (docket ${logDocket})`,
    );

    applicationContext.logger.info(
      `Starting generate PDF from HTML helper (local Chromium) for docket ${logDocket}`,
    );

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

    applicationContext.logger.info(
      `Finished generate PDF from HTML helper (local Chromium) for docket ${logDocket}`,
    );

    return result;
  }

  const { currentColor, stage } = applicationContext.environment;
  let client;
  try {
    client = getLambdaClient();
  } catch (e: any) {
    applicationContext.logger.error('failed to get lambda client:', e);
  }
  let response;
  try {
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

    applicationContext.logger.info(
      `Starting PDF generator Lambda invoke for docket ${logDocket}`,
    );

    response = await client.send(command);

    applicationContext.logger.info(
      `Finished PDF generator Lambda invoke for docket ${logDocket}`,
    );
  } catch (e: any) {
    applicationContext.logger.error('failed to send invoke command:', e);
  }
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

  applicationContext.logger.info(
    `Starting get temp PDF document from storage for docket ${logDocket}`,
  );

  const pdfBytes = await applicationContext.getPersistenceGateway().getDocument({
    applicationContext,
    key,
    useTempBucket: true,
  });

  applicationContext.logger.info(
    `Finished get temp PDF document from storage for docket ${logDocket}`,
  );

  return pdfBytes;
};
