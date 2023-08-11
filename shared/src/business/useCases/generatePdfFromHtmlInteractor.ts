import { ALLOWLIST_FEATURE_FLAGS } from '../entities/EntityConstants';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';

export const generatePdfFromHtmlInteractor = async (
  applicationContext: IApplicationContext,
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
    overwriteFooter?: string;
  },
): Promise<Buffer> => {
  const featureFlags = await applicationContext
    .getUseCases()
    .getAllFeatureFlagsInteractor(applicationContext);

  const sendGenerateEvent =
    featureFlags[ALLOWLIST_FEATURE_FLAGS.USE_EXTERNAL_PDF_GENERATION.key];

  if (sendGenerateEvent) {
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
  } else {
    const ret = await applicationContext
      .getUseCaseHelpers()
      .generatePdfFromHtmlHelper(applicationContext, {
        contentHtml,
        displayHeaderFooter,
        docketNumber,
        footerHtml,
        headerHtml,
        overwriteFooter,
      });
    return ret;
  }
};
