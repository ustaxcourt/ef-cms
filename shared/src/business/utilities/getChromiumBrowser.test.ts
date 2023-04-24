import { getChromiumBrowser } from './getChromiumBrowser';
import chromium from '@sparticuz/chrome-aws-lambda';
jest.mock('@sparticuz/chrome-aws-lambda', () => ({
  puppeteer: {
    launch: jest.fn(),
  },
}));

describe('getChromiumBrowser', () => {
  it('launches a chromium.puppeteer instance', async () => {
    await getChromiumBrowser();
    expect(chromium.puppeteer.launch).toHaveBeenCalled();
  });
});
