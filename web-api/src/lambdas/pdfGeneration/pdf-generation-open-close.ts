import { getChromiumBrowser } from '@shared/business/utilities/getChromiumBrowser';
import { getUniqueId } from '@shared/sharedAppContext';
import {
  generatePdfFromHtmlHelper,
  GeneratePdfRequest,
} from '@web-api/business/useCaseHelper/generatePdfFromHtmlHelper';
import { saveDocumentFromLambda } from '@web-api/persistence/s3/saveDocumentFromLambda';

export const openAndCloseAlot = async (event: GeneratePdfRequest) => {
  const browser = await getChromiumBrowser();

  const results = await generatePdfFromHtmlHelper(event, browser);

  const pages = await browser.pages();
  await Promise.all(pages.map(p => p.close()));

  const tempId = getUniqueId();

  await saveDocumentFromLambda({
    document: results,
    key: tempId,
    useTempBucket: true,
  });

  return { tempId };
};

/*
 - Use a singleton
 - Promise.race([browser.close])
 - retry multiple times
 - Add an alarm
 - Maybe add to DLQ?
*/
