const { getChromiumBrowser } = require('./getChromiumBrowser');

describe('getChromiumBrowser', () => {
  let launchMock;

  beforeEach(() => {
    launchMock = jest.fn();

    const mockChromium = {
      launch: launchMock,
    };
    jest.mock('puppeteer', () => mockChromium);
  });

  it('launches a chromium.puppeteer instance', async () => {
    await getChromiumBrowser();
    expect(launchMock).toHaveBeenCalled();
  });
});
