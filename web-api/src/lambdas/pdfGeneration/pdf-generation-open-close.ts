import { getChromiumBrowser } from '@shared/business/utilities/getChromiumBrowser';

export const openAndCloseAlot = async () => {
  for (let index = 0; index < 30; index++) {
    const browser = await getChromiumBrowser();
    await Promise.race([browser.close(), browser.close(), browser.close()]);
  }
};



/*
 - Use a singleton
 - Promise.race([browser.close])
 - retry multiple times
 - Add an alarm
 - Maybe add to DLQ?
*/