import { cloneDeep } from 'lodash';
jest.mock('@shared/tools/helpers', () => ({
  sleep: () => console.log('SLEEPING TIGER'),
}));
describe('getChromiumBrowserLocal', () => {
  const originalEnv = cloneDeep(process.env);

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should use puppeteer instance of chromium when in the local stage', async () => {
    jest.mock('@web-api/environment', () => ({
      environment: { stage: 'local' },
    }));

    jest.mock('puppeteer', () => ({
      __esModule: true,
      default: {
        launch: jest.fn(() =>
          Promise.resolve({
            close: jest.fn(),
          }),
        ),
      },
    }));

    jest.mock('@sparticuz/chromium', () => ({}));
    jest.mock('puppeteer-core', () => ({}));

    const { getChromiumBrowser } = await import(
      '@shared/business/utilities/getChromiumBrowser'
    );

    const browser = await getChromiumBrowser();

    const launchCalls = require('puppeteer').default.launch.mock.calls;
    expect(launchCalls.length).toEqual(1);
    expect(launchCalls[0][0]).toEqual({
      args: ['--no-sandbox'],
    });

    await browser.close();
    const closeCalls = (browser.close as jest.Mock).mock.calls;
    expect(closeCalls.length).toEqual(1);
  });
});
