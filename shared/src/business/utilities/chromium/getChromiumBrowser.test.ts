jest.mock('@shared/business/utilities/chromium/getChromiumBrowserAws');
jest.mock('@shared/business/utilities/chromium/getChromiumBrowserLocal');
jest.mock('@web-api/environment');

import { getChromiumBrowser as getChromiumBrowserImport } from '@shared/business/utilities/chromium/getChromiumBrowser';

const getChromiumBrowser = getChromiumBrowserImport;
import { getChromiumBrowserAWS as getChromiumBrowserAWSMock } from '@shared/business/utilities/chromium/getChromiumBrowserAws';
import { getChromiumBrowserLocal as getChromiumBrowserLocalMock } from '@shared/business/utilities/chromium/getChromiumBrowserLocal';
import { environment as environmentMock } from '@web-api/environment';
import { Browser } from 'puppeteer-core';

describe('getChromiumBrowser', () => {
  const getChromiumBrowserAWS = jest.mocked(getChromiumBrowserAWSMock);

  const getChromiumBrowserLocal = jest.mocked(getChromiumBrowserLocalMock);

  const environment = jest.mocked(environmentMock);

  beforeEach(() => {
    environment.stage = 'prod';
  });

  it('should get local browser in local context', async () => {
    environment.stage = 'local';
    await getChromiumBrowser();
    expect(getChromiumBrowserLocal).toHaveBeenCalled();
    expect(getChromiumBrowserAWS).not.toHaveBeenCalled();
  });
  it('should get prod browser in prod context', async () => {
    await getChromiumBrowser();
    expect(getChromiumBrowserAWS).toHaveBeenCalled();
    expect(getChromiumBrowserLocal).not.toHaveBeenCalled();
  });
  it('should return existing browser', async () => {
    getChromiumBrowserAWS.mockReturnValueOnce({} as Promise<Browser>);
    await getChromiumBrowser();
    await getChromiumBrowser();
    expect(getChromiumBrowserAWS).toHaveBeenCalledTimes(1);
  });
});
