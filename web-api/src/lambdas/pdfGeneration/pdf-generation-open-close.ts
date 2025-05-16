import { getChromiumBrowserAWS } from '@shared/business/utilities/getChromiumBrowser';

export const openAndCloseAlot = async () => {
  for (let index = 0; index < 30; index++) {
    const browser = await getChromiumBrowserAWS();
    await Promise.race([browser.close(), browser.close(), browser.close()]);
  }
};
