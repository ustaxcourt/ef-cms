import cypress from 'cypress';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { main } from './run-cypress-tests-with-timing';

jest.mock('cypress', () => ({
  __esModule: true,
  default: {
    run: jest.fn(),
  },
}));

describe('run-cypress-tests-with-timing', () => {
  const mockedCypressRun = jest.mocked(cypress.run);
  const originalExit = process.exit;
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'run-cypress-tests-with-timing-'),
  );

  beforeEach(() => {
    jest.clearAllMocks();
    process.exit = jest.fn() as typeof process.exit;
    delete process.env.CYPRESS_AWS_ACCESS_KEY_ID;
    delete process.env.CYPRESS_AWS_SECRET_ACCESS_KEY;
    delete process.env.CYPRESS_CHECK_DEPLOY_DATE_INTERVAL;
  });

  afterAll(() => {
    process.exit = originalExit;
    fs.rmSync(tempDir, { force: true, recursive: true });
  });

  it('writes standardized cypress timings and exits with the test failure count', async () => {
    const outputFilePath = path.join(tempDir, 'timings.json');

    mockedCypressRun.mockResolvedValue({
      runs: [
        {
          spec: {
            relative: 'cypress/local-only/tests/integration/example.cy.ts',
          },
          stats: {
            duration: 2500,
          },
        },
      ],
      totalFailed: 0,
    } as Awaited<ReturnType<typeof cypress.run>>);

    await main([
      'cypress.config.ts',
      './cypress/local-only/tests/integration/example.cy.ts',
      outputFilePath,
    ]);

    expect(mockedCypressRun).toHaveBeenCalledWith({
      browser: 'edge',
      configFile: 'cypress.config.ts',
      spec: './cypress/local-only/tests/integration/example.cy.ts',
    });
    expect(JSON.parse(fs.readFileSync(outputFilePath, 'utf8'))).toEqual({
      './cypress/local-only/tests/integration/example.cy.ts': 2500,
    });
    expect(process.env.CYPRESS_AWS_ACCESS_KEY_ID).toEqual('S3RVER');
    expect(process.env.CYPRESS_AWS_SECRET_ACCESS_KEY).toEqual('S3RVER');
    expect(process.env.CYPRESS_CHECK_DEPLOY_DATE_INTERVAL).toEqual('5000');
    expect(process.exit).toHaveBeenCalledWith(0);
  });

  it('throws when cypress run fails before spec execution', async () => {
    mockedCypressRun.mockResolvedValue({
      failures: 1,
      message: 'boom',
      status: 'failed',
    });

    await expect(
      main(['cypress.config.ts', './spec.cy.ts', path.join(tempDir, 'x.json')]),
    ).rejects.toThrow('boom');
  });

  it('throws when required arguments are missing', async () => {
    await expect(main(['cypress.config.ts'])).rejects.toThrow(
      'Usage: npx ts-node scripts/github-actions/run-cypress-tests-with-timing.ts <config-file> <specs> <output> [browser]',
    );
  });

  it('honors explicit browser and existing cypress env values', async () => {
    const outputFilePath = path.join(tempDir, 'timings-custom.json');

    process.env.CYPRESS_AWS_ACCESS_KEY_ID = 'EXISTING_KEY';
    process.env.CYPRESS_AWS_SECRET_ACCESS_KEY = 'EXISTING_SECRET';
    process.env.CYPRESS_CHECK_DEPLOY_DATE_INTERVAL = '42';

    mockedCypressRun.mockResolvedValue({
      runs: [
        {
          spec: {
            relative: 'cypress/local-only/tests/integration/example.cy.ts',
          },
          stats: {
            duration: 1,
          },
        },
      ],
      totalFailed: 2,
    } as Awaited<ReturnType<typeof cypress.run>>);

    await main([
      'cypress.config.ts',
      './cypress/local-only/tests/integration/example.cy.ts',
      outputFilePath,
      'chrome',
    ]);

    expect(mockedCypressRun).toHaveBeenCalledWith({
      browser: 'chrome',
      configFile: 'cypress.config.ts',
      spec: './cypress/local-only/tests/integration/example.cy.ts',
    });
    expect(process.env.CYPRESS_AWS_ACCESS_KEY_ID).toEqual('EXISTING_KEY');
    expect(process.env.CYPRESS_AWS_SECRET_ACCESS_KEY).toEqual(
      'EXISTING_SECRET',
    );
    expect(process.env.CYPRESS_CHECK_DEPLOY_DATE_INTERVAL).toEqual('42');
    expect(process.exit).toHaveBeenCalledWith(2);
  });
});
