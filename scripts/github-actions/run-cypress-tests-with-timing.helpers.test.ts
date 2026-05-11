jest.mock('cypress', () => ({
  open: jest.fn(),
  run: jest.fn(),
}));

import { runCypressWithTiming } from './run-cypress-tests-with-timing.helpers';

describe('run-cypress-tests-with-timing', () => {
  const createDependencies = () => {
    return {
      cypressRunner: {
        open: jest.fn(),
        run: jest.fn(),
      },
      dawson: { isLocal: true, isPublic: false },
      env: {} as NodeJS.ProcessEnv,
      exit: jest.fn(),
      getCypressTestFileTimes: jest.fn(),
      writeTestFileTimes: jest.fn(),
    };
  };

  it('runs Cypress with default environment values and writes timing data', async () => {
    const dependencies = createDependencies();
    const cypressResults = {
      runs: [
        {
          spec: {
            relative: 'cypress/local-only/tests/example.cy.ts',
          },
          stats: {
            duration: 1234,
          },
        },
      ],
      totalFailed: 2,
    };
    const testFileTimes = {
      './cypress/local-only/tests/example.cy.ts': 1234,
    };

    dependencies.cypressRunner.run.mockResolvedValue(cypressResults);
    dependencies.getCypressTestFileTimes.mockReturnValue(testFileTimes);

    await runCypressWithTiming({
      configFile: 'cypress.config.ts',
      current: false,
      dependencies,
      outputFilePath: 'timings.json',
    });

    expect(dependencies.env.CYPRESS_TARGET_ENV).toBe('local');
    expect(dependencies.env.CYPRESS_AWS_ACCESS_KEY_ID).toBe('S3RVER');
    expect(dependencies.env.CYPRESS_AWS_SECRET_ACCESS_KEY).toBe('S3RVER');
    expect(dependencies.env.CYPRESS_CHECK_DEPLOY_DATE_INTERVAL).toBe('5000');
    expect(dependencies.env.CYPRESS_SMOKETESTS_LOCAL).toBeUndefined();
    expect(dependencies.env.CYPRESS_BASE_URL).toBeUndefined();
    expect(dependencies.cypressRunner.run).toHaveBeenCalledWith({
      browser: 'edge',
      configFile: 'cypress.config.ts',
      spec: 'cypress/local-only/tests/example.cy.ts',
    });
    expect(dependencies.getCypressTestFileTimes).toHaveBeenCalledWith({
      results: cypressResults,
    });
    expect(dependencies.writeTestFileTimes).toHaveBeenCalledWith({
      filePath: 'timings.json',
      testFileTimes,
    });
    expect(dependencies.exit).toHaveBeenCalledWith(2);
  });

  it('preserves existing environment values and honors a provided browser', async () => {
    const dependencies = createDependencies();
    const cypressResults = {
      runs: [],
      totalFailed: 0,
    };

    dependencies.env.CYPRESS_AWS_ACCESS_KEY_ID = 'existing-access-key';
    dependencies.env.CYPRESS_AWS_SECRET_ACCESS_KEY = 'existing-secret';
    dependencies.env.CYPRESS_CHECK_DEPLOY_DATE_INTERVAL = '9000';
    dependencies.cypressRunner.run.mockResolvedValue(cypressResults);
    dependencies.getCypressTestFileTimes.mockReturnValue({});

    await runCypressWithTiming({
      browserArg: 'chrome',
      configFile: 'cypress-public.config.ts',
      current: false,
      dependencies,
      outputFilePath: 'timings.json',
      specs: 'spec-a.cy.ts,spec-b.cy.ts',
    });

    expect(dependencies.env.CYPRESS_AWS_ACCESS_KEY_ID).toBe(
      'existing-access-key',
    );
    expect(dependencies.env.CYPRESS_AWS_SECRET_ACCESS_KEY).toBe(
      'existing-secret',
    );
    expect(dependencies.env.CYPRESS_CHECK_DEPLOY_DATE_INTERVAL).toBe('9000');
    expect(dependencies.cypressRunner.run).toHaveBeenCalledWith({
      browser: 'chrome',
      configFile: 'cypress-public.config.ts',
      spec: 'spec-a.cy.ts,spec-b.cy.ts',
    });
    expect(dependencies.exit).toHaveBeenCalledWith(0);
  });

  it('disables command logs and forwards ENV', async () => {
    const dependencies = createDependencies();
    const cypressResults = {
      runs: [],
      totalFailed: 0,
    };

    dependencies.env.CI = 'true';
    dependencies.env.ENV = 'jest';
    dependencies.cypressRunner.run.mockResolvedValue(cypressResults);
    dependencies.getCypressTestFileTimes.mockReturnValue({});

    await runCypressWithTiming({
      configFile: 'cypress.config.ts',
      current: false,
      dependencies,
      outputFilePath: 'timings.json',
      specs: 'example.cy.ts',
    });

    expect(dependencies.env.CYPRESS_NO_COMMAND_LOG).toBe('1');
    expect(dependencies.env.CYPRESS_TARGET_ENV).toBe('jest');
  });

  it('sets correct defaults for private smoketests', async () => {
    const dependencies = createDependencies();
    dependencies.cypressRunner.run.mockResolvedValue({
      runs: [],
      totalFailed: 0,
    });

    await runCypressWithTiming({
      configFile: 'cypress-smoketests-private.config.ts',
      current: false,
      dependencies,
      outputFilePath: 'timings.json',
      specs: 'example.cy.ts',
    });

    expect(dependencies.env.CYPRESS_SMOKETESTS_LOCAL).toBe('true');
    expect(dependencies.env.CYPRESS_BASE_URL).toBe('http://localhost:1234');
    expect(dependencies.cypressRunner.run).toHaveBeenCalledWith({
      browser: 'edge',
      configFile: 'cypress-smoketests.config.ts',
      spec: 'example.cy.ts',
    });
  });

  it('sets correct defaults for public smoketests', async () => {
    const dependencies = createDependencies();
    dependencies.cypressRunner.run.mockResolvedValue({
      runs: [],
      totalFailed: 0,
    });

    await runCypressWithTiming({
      configFile: 'cypress-smoketests-public.config.ts',
      current: false,
      dependencies,
      outputFilePath: 'timings.json',
      specs: 'example.cy.ts',
    });

    expect(dependencies.env.CYPRESS_SMOKETESTS_LOCAL).toBe('true');
    expect(dependencies.env.CYPRESS_BASE_URL).toBe('http://localhost:5678');
    expect(dependencies.cypressRunner.run).toHaveBeenCalledWith({
      browser: 'chrome',
      configFile: 'cypress-smoketests-public.config.ts',
      spec: 'example.cy.ts',
    });
  });

  it('defaults to chrome for public integration tests', async () => {
    const dependencies = createDependencies();
    dependencies.cypressRunner.run.mockResolvedValue({
      runs: [],
      totalFailed: 0,
    });

    await runCypressWithTiming({
      configFile: 'cypress-public.config.ts',
      current: false,
      dependencies,
      outputFilePath: 'timings.json',
      specs: 'example.cy.ts',
    });

    expect(dependencies.env.CYPRESS_BASE_URL).toBeUndefined();
    expect(dependencies.cypressRunner.run).toHaveBeenCalledWith({
      browser: 'chrome',
      configFile: 'cypress-public.config.ts',
      spec: 'example.cy.ts',
    });
  });

  it('preserves existing CYPRESS_BASE_URL', async () => {
    const dependencies = createDependencies();
    dependencies.env.CYPRESS_BASE_URL = 'http://existing:9999';
    dependencies.cypressRunner.run.mockResolvedValue({
      runs: [],
      totalFailed: 0,
    });

    await runCypressWithTiming({
      configFile: 'cypress-smoketests.config.ts',
      current: false,
      dependencies,
      outputFilePath: 'timings.json',
      specs: 'example.cy.ts',
    });

    expect(dependencies.env.CYPRESS_BASE_URL).toBe('http://existing:9999');
  });

  it('sets correct defaults for real user tests', async () => {
    const dependencies = createDependencies();
    dependencies.cypressRunner.run.mockResolvedValue({
      runs: [],
      totalFailed: 0,
    });

    await runCypressWithTiming({
      configFile: 'cypress-real-user-tests.config.ts',
      current: false,
      dependencies,
      outputFilePath: 'timings.json',
      specs: 'example.cy.ts',
    });

    expect(dependencies.env.CYPRESS_SMOKETESTS_LOCAL).toBeUndefined();
    expect(dependencies.env.CYPRESS_BASE_URL).toBe('http://localhost:1234');
    expect(dependencies.cypressRunner.run).toHaveBeenCalledWith({
      browser: 'edge',
      configFile: 'cypress-real-user-tests.config.ts',
      spec: 'example.cy.ts',
    });
  });

  it('throws the Cypress failure message and skips writing timings when the run fails', async () => {
    const dependencies = createDependencies();

    dependencies.cypressRunner.run.mockResolvedValue({
      failures: 1,
      message: 'Cypress failed to launch',
    });

    await expect(
      runCypressWithTiming({
        configFile: 'cypress.config.ts',
        current: false,
        dependencies,
        outputFilePath: 'timings.json',
        specs: 'example.cy.ts',
      }),
    ).rejects.toThrow('Cypress failed to launch');

    expect(dependencies.getCypressTestFileTimes).not.toHaveBeenCalled();
    expect(dependencies.writeTestFileTimes).not.toHaveBeenCalled();
    expect(dependencies.exit).not.toHaveBeenCalled();
  });
});
