const { getChromiumBrowser } = require('./getChromiumBrowser');

describe('getChromiumBrowser', () => {
  let launchMock;

  beforeEach(() => {
    launchMock = jest.fn();
    const mockPuppeteer = {
      launch: launchMock,
    };

    jest.mock('@sparticuz/chromium', () => jest.fn());
    jest.mock('puppeteer-core', () => mockPuppeteer);
  });

  it('launches a chromium.puppeteer instance', async () => {
    await getChromiumBrowser();
    expect(launchMock).toHaveBeenCalled();
  });
});
