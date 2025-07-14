import { cloneDeep } from 'lodash';
jest.mock('@shared/tools/helpers', () => ({
  sleep: () => console.log('SLEEPING TIGER'),
}));
describe('getChromiumBrowserLocal', () => {
  const originalEnv = cloneDeep(process.env);

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should use @sparticuz/chromium and puppeteer-core instance of chromium when not in the local stage', async () => {
    process.env.LD_LIBRARY_PATH = 'TEST_LD_LIBRARY_PATH';
    process.env.PATH = 'TEST_PATH';
    process.env.FONTCONFIG_PATH = 'TEST_FONTCONFIG_PATH';

    jest.mock('@web-api/environment', () => ({
      environment: { stage: 'NOT_LOCAL' },
    }));

    jest.mock('puppeteer', () => ({}));

    jest.mock('@sparticuz/chromium', () => ({
      __esModule: true,
      default: {
        args: 'TEST_ARGS',
        defaultViewport: 'TEST_DEFAULT_VIEWPORT',
        headless: 'TEST_HEADLESS',
        executablePath: () => 'EXECUTABLE_PATH_RESULTS',
      },
    }));

    jest.mock('puppeteer-core', () => ({
      __esModule: true,
      default: {
        launch: jest.fn(() =>
          Promise.resolve({
            close: jest.fn(),
          }),
        ),
      },
    }));

    const { getChromiumBrowser } = await import(
      '@shared/business/utilities/getChromiumBrowser'
    );

    const browser = await getChromiumBrowser();

    const launchCalls = require('puppeteer-core').default.launch.mock.calls;
    expect(launchCalls.length).toEqual(1);
    expect(launchCalls[0][0]).toEqual({
      args: 'TEST_ARGS',
      defaultViewport: 'TEST_DEFAULT_VIEWPORT',
      env: {
        FONTCONFIG_PATH: 'TEST_FONTCONFIG_PATH',
        LD_LIBRARY_PATH: 'TEST_LD_LIBRARY_PATH',
        PATH: 'TEST_PATH',
      },
      executablePath: 'EXECUTABLE_PATH_RESULTS',
      headless: 'TEST_HEADLESS',
    });

    await browser.close();
    const closeCalls = (browser.close as jest.Mock).mock.calls;
    expect(closeCalls.length).toEqual(1);
  });
});
