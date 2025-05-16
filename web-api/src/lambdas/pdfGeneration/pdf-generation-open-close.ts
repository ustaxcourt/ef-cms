import { getChromiumBrowser } from '@shared/business/utilities/getChromiumBrowser';
import { getUniqueId } from '@shared/sharedAppContext';
import { sleep } from '@shared/tools/helpers';
import {
  generatePdfFromHtmlHelper,
  GeneratePdfRequest,
} from '@web-api/business/useCaseHelper/generatePdfFromHtmlHelper';
import { saveDocumentFromLambda } from '@web-api/persistence/s3/saveDocumentFromLambda';
import { getLogger } from '@web-api/utilities/logger/getLogger';
import { Browser } from 'puppeteer-core';

export const openAndCloseAlot = async (event: GeneratePdfRequest) => {
  let browser: Browser | null = null;
  for (let index = 0; index < 10; index++) {
    try {
      const shouldReset = index != 0;
      browser = await getChromiumBrowser({ resetSingleton: shouldReset });
      break;
    } catch (e) {
      getLogger().error(
        `Unable to launch chromium browser on attempt: ${index}`,
      );
      await sleep(100);
    }
  }

  if (!browser) {
    throw new Error('Failed to launch chromium, so cannot produce a pdf');
  }

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
