const { getChromiumBrowser } = require('./getChromiumBrowser');

describe('getChromiumBrowser', () => {
  let launchMock;

  beforeEach(() => {
    launchMock = jest.fn();

    const mockChromium = {
      puppeteer: {
        launch: launchMock,
      },
    };
    jest.mock('@sparticuz/chromium', () => mockChromium);
  });

  it('launches a chromium.puppeteer instance', async () => {
    await getChromiumBrowser();
    expect(launchMock).toHaveBeenCalled();
  });
});
